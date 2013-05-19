var crypto = require('crypto');
var xml2js = require('xml2js');
var ejs = require('ejs');
var BufferHelper = require('bufferhelper');
var Session = require('./session');
var List = require('./list');

var checkSignature = function (query, token) {
  var signature = query.signature;
  var timestamp = query.timestamp;
  var nonce = query.nonce;

  var shasum = crypto.createHash('sha1');
  var arr = [token, timestamp, nonce].sort();
  shasum.update(arr.join(''));

  return shasum.digest('hex') === signature;
};

var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
    '</Music>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
    '<FuncFlag><%=funcFlag%></FuncFlag>',
  '</xml>'].join('');

var compiled = ejs.compile(tpl);

var getMessage = function (stream, callback) {
  var buf = new BufferHelper();
  buf.load(stream, function (err, buf) {
    if (err) {
      return callback(err);
    }
    var xml = buf.toString('utf-8');
    xml2js.parseString(xml, {trim: true}, callback);
  });
};

var isEmpty = function (thing) {
  return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
};

var formatMessage = function (result) {
  var message = {};
  for (var key in result.xml) {
    var val = result.xml[key][0];
    message[key] = (isEmpty(val) ? '' : val).trim();
  }
  return message;
};

var respond = function (handler) {
  return function (req, res, next) {
    getMessage(req, function (err, result) {
      if (err) {
        err.name = 'BadMessage' + err.name;
        return next(err);
      }
      var message = formatMessage(result);
      var callback = handler.getHandler(message.MsgType);
      req.weixin = message;
      res.reply = function (content, funcFlag) {
        var info = {};
        info.content = content || '';
        info.createTime = new Date().getTime();
        info.msgType = Array.isArray(content) ? 'news' : (typeof content === 'object' ? 'music' : 'text');
        info.funcFlag = funcFlag ? 1 : 0;
        info.toUsername = message.FromUserName;
        info.fromUsername = message.ToUserName;
        res.writeHead(200);
        res.end(compiled(info));
      };

      var done = function () {
        // 如果session中有_wait标记
        if (message.MsgType === 'text' && req.wxsession && req.wxsession._wait) {
          var list = List.get(req.wxsession._wait);
          var handle = list.get(message.Content);
          var wrapper = function (message) {
            return function (info, req, res) {
              res.reply(message);
            };
          };

          // 如果回复命中规则，则用预置的方法回复
          if (handle) {
            callback = typeof handle === 'string' ? wrapper(handle) : handle;
          }
        }

        // 兼容旧API
        if (handler.handle) {
          callback(req, res, next);
        } else {
          callback(message, req, res, next);
        }
      };

      if (req.sessionStore) {
        var storage = req.sessionStore;
        var _end = res.end;
        var openid = message.FromUserName;
        res.end = function () {
          _end.apply(res, arguments);
          if (req.wxsession) {
            req.wxsession.save();
          }
        };

        // 等待列表
        res.wait = function (name) {
          var list = List.get(name);
          if (list) {
            req.wxsession._wait = name;
            res.reply(list.description);
          } else {
            var err = new Error('Undefined list: ' + name);
            err.name = 'UndefinedListError';
            console.error(err.stack);
            res.writeHead(500);
            res.end(err.name);
          }
        };

        // 清除等待列表
        res.nowait = function () {
          delete req.wxsession._wait;
          res.reply.apply(res, arguments);
        };

        storage.get(openid, function (err, session) {
          if (!session) {
            req.wxsession = new Session(openid, req);
            req.wxsession.cookie = req.session.cookie;
          } else {
            req.wxsession = new Session(openid, req, session);
          }
          done();
        });
      } else {
        done();
      }
    });
  };
};

var Handler = function (token, handle) {
  this.token = token;
  this.handlers = {};
  this.handle = handle;
};

Handler.prototype.setHandler = function (type, fn) {
  this.handlers[type] = fn;
  return this;
};

Handler.prototype.getHandler = function (type) {
  return this.handle || this.handlers[type] || function (info, req, res, next) {
    next();
  };
};
['text', 'image', 'location', 'voice', 'link', 'event'].forEach(function (method) {
  Handler.prototype[method] = function (fn) {
    return this.setHandler(method, fn);
  };
});

Handler.prototype.middlewarify = function () {
  var token = this.token;
  var _respond = respond(this);
  return function (req, res, next) {
    // 动态token，在前置中间件中设置该值req.wechat_token，优先选用
    if (!checkSignature(req.query, req.wechat_token || token)) {
      res.writeHead(401);
      res.end('Invalid signature');
      return;
    }
    var method = req.method;
    if (method === 'GET') {
      res.writeHead(200);
      res.end(req.query.echostr);
    } else if (method === 'POST') {
      _respond(req, res, next);
    } else {
      res.writeHead(501);
      res.end('Not Implemented');
    }
  };
};

/**
 * Examples:
 * ```
 * wechat(token, function (req, res, next) {});
 * wechat(token, wechat.text(function (message, req, res, next) {
 * }).location(function (message, req, res, next) {
 * }));
 * wechat(token)
 *  .text(function (message, req, res, next) {})
 *  .location(function (message, req, res, next) {})
 *  .middleware();
 * ```
 * @param {String} token 在微信平台填写的口令
 * @param {Function} handle 生成的回调函数，参见示例
 */
var middleware = function (token, handle) {
  if (arguments.length === 1) {
    return new Handler(token);
  }

  if (arguments.length === 2) {
    if (handle instanceof Handler) {
      handle.token = token;
      return handle.middlewarify();
    } else {
      return new Handler(token, handle).middlewarify();
    }
  }
};

/**
 * 文字推送处理
 * @param {Function} fn 处理文字推送的回调函数，接受参数为(text, req, res, next)。
 */

/**
 * 图片推送处理
 * @param {Function} fn 处理图片推送的回调函数，接受参数为(image, req, res, next)。
 */

/**
 * 位置推送处理
 * @param {Function} fn 处理位置推送的回调函数，接受参数为(location, req, res, next)。
 */

/**
 * 声音推送处理
 * @param {Function} fn 处理声音推送的回调函数，接受参数为(voice, req, res, next)。
 */

/**
 * 链接推送处理
 * @param {Function} fn 处理链接推送的回调函数，接受参数为(link, req, res, next)。
 */

/**
 * 事件推送处理
 * @param {Function} fn 处理事件推送的回调函数，接受参数为(event, req, res, next)。
 */
['text', 'image', 'location', 'voice', 'link', 'event'].forEach(function (method) {
  middleware[method] = function (fn) {
    return (new Handler())[method](fn);
  };
});

module.exports = middleware;
module.exports.toXML = compiled;
