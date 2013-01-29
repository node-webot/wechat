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

var valid = function (token) {
  return function (req, res, next) {
    if (checkSignature(req.query, token)) {
      res.writeHead(200);
      res.end(req.query.echostr);
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
  '<% if (Array.isArray(content)) { %>',
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
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
    '<FuncFlag><%=funcFlag%></FuncFlag>',
  '</xml>'].join('');

var complied = ejs.compile(tpl);

var respond = function (handler) {
  return function (req, res, next) {
    var buf = new BufferHelper();
    req.on('data', function (chunk) {
      buf.concat(chunk);
    });
    req.on('end', function () {
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
            info.msgType = Array.isArray(content) ? 'news' : 'text';
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

Handler.prototype.middleware = function () {
  var _valid = valid(this.token);
  var _respond = respond(this);
  return function (req, res, next) {
    var method = req.method;
    if (method === 'GET') {
      _valid(req, res, next);
    } else if (method === 'POST') {
      _respond(req, res, next);
    } else {
      next();
    }
  };
};

/**
 * Examples:
 * wechat(token, function (req, res, next) {});
 * wechat(token, wechat.text(function (message, req, res, next) {}).location(function (message, req, res, next) {}) {});
 * wechat(token)
 *  .text(function (message, req, res, next) {}).location(function (message, req, res, next) {}).middleware();
 */
var middleware = function (token, handle) {
  if (arguments.length === 1) {
    return new Handler(token);
  }

  if (arguments.length === 2) {
    if (handle instanceof Handler) {
      handle.token = token;
      return handle.middleware();
    } else {
      return new Handler(token, handle).middleware();
    }
  }
};

middleware.text = function (fn) {
  return (new Handler()).text(fn);
};

middleware.image = function (fn) {
  return (new Handler()).image(fn);
};

middleware.location = function (fn) {
  return (new Handler()).location(fn);
};

middleware.voice = function (fn) {
  return (new Handler()).voice(fn);
};

module.exports = middleware;
