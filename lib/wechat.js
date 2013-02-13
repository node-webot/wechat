var crypto = require('crypto');
var xml2js = require('xml2js');
var ejs = require('ejs');
var BufferHelper = require('bufferhelper');

var checkSignature = function (query, token) {
  var signature = query.signature;
  var timestamp = query.timestamp;
  var nonce = query.nonce;

  var shasum = crypto.createHash('sha1');
  var arr = [token, timestamp, nonce].sort();
  shasum.update(arr.join(''));

  return shasum.digest('hex') === signature;
};

var parser = new xml2js.Parser();

var valid = function (token, fn) {
  return function (req, res, next) {
    if (checkSignature(req.query, token)) {
      if (req.method === 'GET') {
        res.writeHead(200);
        res.end(req.query.echostr);
      } else if (req.method === 'POST') {
        fn(req, res, next);
      } else {
        next();
      }
    } else {
      res.writeHead(401);
      res.end('sorry');
    }
  };
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
        '<Title><![CDATA[<%=item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%=item.picurl%>]]></PicUrl>',
        '<Url><![CDATA[<%=item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%=content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%=content.musicUrl%>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%=content.hdMusicUrl%>]]></HQMusicUrl>',
    '</Music>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
    '<FuncFlag><%=funcFlag%></FuncFlag>',
  '</xml>'].join('');

var complied = ejs.compile(tpl);

var respond = function (handler) {
  return function (req, res, next) {
    var buf = new BufferHelper();
    buf.load(req, function (buf) {
      var xml = buf.toString('utf-8');
      if (xml) {
        parser.parseString(xml, function (err, result) {
          if (err) return next(err);
          var weixin = {};
          for (var key in result.xml) {
            weixin[key] = result.xml[key][0];
          }
          var callback = handler.getHandler(weixin.MsgType);
          req.weixin = weixin;
          res.reply = function (content, funcFlag) {
            var info = {};
            info.content = content || '';
            info.createTime = new Date().getTime();
            info.msgType = Array.isArray(content) ? 'news' : (typeof content === 'object' ? 'music' : 'text');
            info.funcFlag = funcFlag ? 1 : 0;
            info.toUsername = weixin.FromUserName;
            info.fromUsername = weixin.ToUserName;

            res.writeHead(200);
            res.end(complied(info));
          };
          // 兼容旧API
          if (handler.handle) {
            callback(req, res, next);
          } else {
            callback(weixin, req, res, next);
          }
        });
      } else {
        res.writeHead(400);
        res.end('Empty Post');
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

Handler.prototype.text = function (fn) {
  return this.setHandler('text', fn);
};

Handler.prototype.image = function (fn) {
  return this.setHandler('image', fn);
};

Handler.prototype.location = function (fn) {
  return this.setHandler('location', fn);
};

Handler.prototype.voice = function (fn) {
  return this.setHandler('voice', fn);
};

Handler.prototype.link = function (fn) {
  return this.setHandler('link', fn);
};

Handler.prototype.event = function (fn) {
  return this.setHandler('event', fn);
};

Handler.prototype.middlewarify = function () {
  var _token = this.token;
  var _respond = respond(this);
  return function (req, res, next) {
    valid(_token, _respond)(req, res, next);
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
middleware.text = function (fn) {
  return (new Handler()).text(fn);
};

/**
 * 图片推送处理
 * @param {Function} fn 处理图片推送的回调函数，接受参数为(image, req, res, next)。
 */
middleware.image = function (fn) {
  return (new Handler()).image(fn);
};

/**
 * 位置推送处理
 * @param {Function} fn 处理位置推送的回调函数，接受参数为(location, req, res, next)。
 */
middleware.location = function (fn) {
  return (new Handler()).location(fn);
};

/**
 * 声音推送处理
 * @param {Function} fn 处理声音推送的回调函数，接受参数为(voice, req, res, next)。
 */
middleware.voice = function (fn) {
  return (new Handler()).voice(fn);
};

/**
 * 链接推送处理
 * @param {Function} fn 处理链接推送的回调函数，接受参数为(link, req, res, next)。
 */
middleware.link = function (fn) {
  return (new Handler()).link(fn);
};

/**
 * 事件推送处理
 * @param {Function} fn 处理事件推送的回调函数，接受参数为(event, req, res, next)。
 */
middleware.event = function (fn) {
  return (new Handler()).event(fn);
};

module.exports = middleware;
