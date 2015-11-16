var crypto = require('crypto');
var xml2js = require('xml2js');
var ejs = require('ejs');
var Session = require('./session');
var List = require('./list');
var WXBizMsgCrypt = require('wechat-crypto');

/**
 * 检查签名
 */
var checkSignature = function (query, token) {
  var signature = query.signature;
  var timestamp = query.timestamp;
  var nonce = query.nonce;

  var shasum = crypto.createHash('sha1');
  var arr = [token, timestamp, nonce].sort();
  shasum.update(arr.join(''));

  return shasum.digest('hex') === signature;
};

/*!
 * 响应模版
 */
var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% } %>',
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
      '<% if (content.thumbMediaId) { %> ',
      '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
      '<% } %>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (msgType === "device_text") { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl);

var wrapTpl = '<xml>' +
  '<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>' +
  '<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>' +
  '<TimeStamp><%-timestamp%></TimeStamp>' +
  '<Nonce><![CDATA[<%-nonce%>]]></Nonce>' +
'</xml>';

var encryptWrap = ejs.compile(wrapTpl);

var load = function (stream, callback) {
  // support content-type 'text/xml' using 'express-xml-bodyparser', which set raw xml string
  // to 'req.rawBody'(while latest body-parser no longer set req.rawBody), see
  // https://github.com/macedigital/express-xml-bodyparser/blob/master/lib/types/xml.js#L79
  if (stream.rawBody) {
    callback(null, stream.rawBody);
    return;
  }

  var buffers = [];
  stream.on('data', function (trunk) {
    buffers.push(trunk);
  });
  stream.on('end', function () {
    callback(null, Buffer.concat(buffers));
  });
  stream.once('error', callback);
};

/*!
 * 从微信的提交中提取XML文件
 */
var getMessage = function (stream, callback) {
  load(stream, function (err, buf) {
    if (err) {
      return callback(err);
    }
    var xml = buf.toString('utf-8');
    stream.weixin_xml = xml;
    xml2js.parseString(xml, {trim: true}, callback);
  });
};

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
var formatMessage = function (result) {
  var message = {};
  if (typeof result === 'object') {
    for (var key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue;
      }
      if (result[key].length === 1) {
        var val = result[key][0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        result[key].forEach(function (item) {
          message[key].push(formatMessage(item));
        });
      }
    }
  }
  return message;
};

/*!
 * 将内容回复给微信的封装方法
 */
var reply = function (content, fromUsername, toUsername, message) {
  var info = {};
  var type = 'text';
  info.content = content || '';
  info.createTime = new Date().getTime();
  if (message && (message.MsgType === 'device_text' || message.MsgType === 'device_event')) {
    info.DeviceType = message.DeviceType;
    info.DeviceID = message.DeviceID;
    info.SessionID = isNaN(message.SessionID) ? 0 : message.SessionID;
    info.createTime = Math.floor(info.createTime / 1000);
    if (message['Event'] === 'subscribe_status' || message['Event'] === 'unsubscribe_status') {
      delete info.content;
      info.DeviceStatus = isNaN(content) ? 0 : content;
    } else {
      if (!(content instanceof Buffer)) {
        content = String(content);
      }
      info.content = new Buffer(content).toString('base64');
    }
    type = message.MsgType;
    if (message.MsgType === 'device_event') {
      info['Event'] = message['Event'];
    }
  } else if (Array.isArray(content)) {
    type = 'news';
  } else if (typeof content === 'object') {
    if (content.hasOwnProperty('type')) {
      type = content.type;
      if (content.content) {
        info.content = content.content;
      }
      if (content.HardWare) {
        info.HardWare = content.HardWare;
      }
    } else {
      type = 'music';
    }
  }
  info.msgType = type;
  info.toUsername = toUsername;
  info.fromUsername = fromUsername;
  return compiled(info);
};

var reply2CustomerService = function (fromUsername, toUsername, kfAccount) {
  var info = {};
  info.msgType = 'transfer_customer_service';
  info.createTime = new Date().getTime();
  info.toUsername = toUsername;
  info.fromUsername = fromUsername;
  info.content = {};
  if (typeof kfAccount === 'string') {
    info.content.kfAccount = kfAccount;
  }
  return compiled(info);
};

var respond = function (handler) {
  return function (req, res, next) {
    var message = req.weixin;
    var callback = handler.getHandler(message.MsgType);

    /**
     * 根据条件对返回的XML数据加密
     * @param xml
     */
    function encryptXml(xml) {
      if (!req.query.encrypt_type || req.query.encrypt_type === 'raw') {
        return xml;
      } else {
        // 判断是否已有前置cryptor
        var cryptor = req.cryptor || handler.cryptor;
        var wrap = {};
        wrap.encrypt = cryptor.encrypt(xml);
        wrap.nonce = parseInt((Math.random() * 100000000000), 10);
        wrap.timestamp = new Date().getTime();
        wrap.signature = cryptor.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt);
        return encryptWrap(wrap);
      }
    }

    res.reply = function (content) {
      res.writeHead(200);
      // 响应空字符串，用于响应慢的情况，避免微信重试
      if (!content) {
        return res.end('');
      }

      res.end(encryptXml(reply(content, message.ToUserName, message.FromUserName, message)));
    };

    // 响应消息，转到客服模式
    res.transfer2CustomerService = function (kfAccount) {
      res.writeHead(200);

      res.end(encryptXml(reply2CustomerService(message.ToUserName, message.FromUserName, kfAccount)));
    };

    var done = function () {
      // 如果session中有_wait标记
      if (message.MsgType === 'text' && req.wxsession && req.wxsession._wait) {
        var list = List.get(req.wxsession._wait);
        var handle = list.get(message.Content);
        var wrapper = function (message) {
          return handler.handle ? function(req, res) {
            res.reply(message);
          } : function (info, req, res) {
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
      var openid = message.FromUserName + ':' + message.ToUserName;
      res.end = function () {
        _end.apply(res, arguments);
        if (req.wxsession) {
          req.wxsession.save();
        }
      };
      // 等待列表
      res.wait = function (name, callback) {
        var list = List.get(name);
        if (list) {
          req.wxsession._wait = name;
          res.reply(list.description);
        } else {
          var err = new Error('Undefined list: ' + name);
          err.name = 'UndefinedListError';
          res.writeHead(500);
          res.end(err.name);
          callback && callback(err);
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
  };
};

/**
 * 微信自动回复平台的内部的Handler对象
 * @param {String|Object} config 配置
 * @param {Function} handle handle对象
 */
var Handler = function (token, handle) {
  if (token) {
    this.setToken(token);
  }
  this.handlers = {};
  this.handle = handle;
};

Handler.prototype.setToken = function (token) {
  if (typeof token === 'string') {
    this.token = token;
  } else {
    this.token = token.token;
    this.appid = token.appid;
    this.encodingAESKey = token.encodingAESKey;
  }
};

/**
 * 设置handler对象
 * 按消息设置handler对象的快捷方式
 *
 * - `text(fn)`
 * - `image(fn)`
 * - `voice(fn)`
 * - `video(fn)`
 * - `location(fn)`
 * - `link(fn)`
 * - `event(fn)`
 * @param {String} type handler处理的消息类型
 * @param {Function} handle handle对象
 */
Handler.prototype.setHandler = function (type, fn) {
  this.handlers[type] = fn;
  return this;
};

['text', 'image', 'voice', 'video', 'location', 'link', 'event', 'shortvideo', 'hardware', 'device_text', 'device_event'].forEach(function (method) {
  Handler.prototype[method] = function (fn) {
    return this.setHandler(method, fn);
  };
});

/**
 * 根据消息类型取出handler对象
 * @param {String} type 消息类型
 */
Handler.prototype.getHandler = function (type) {
  return this.handle || this.handlers[type] || function (info, req, res, next) {
    next();
  };
};

var serveEncrypt = function (that, req, res, next, _respond) {
  var method = req.method;
  // 加密模式
  var signature = req.query.msg_signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;

  // 判断是否已有前置cryptor
  var cryptor = req.cryptor || that.cryptor;

  if (method === 'GET') {
    var echostr = req.query.echostr;
    if (signature !== cryptor.getSignature(timestamp, nonce, echostr)) {
      res.writeHead(401);
      res.end('Invalid signature');
      return;
    }
    var result = cryptor.decrypt(echostr);
    // TODO 检查appId的正确性
    res.writeHead(200);
    res.end(result.message);
  } else if (method === 'POST') {
    load(req, function (err, buf) {
      if (err) {
        return next(err);
      }
      var xml = buf.toString('utf-8');
      if (!xml) {
        var emptyErr = new Error('body is empty');
        emptyErr.name = 'Wechat';
        return next(emptyErr);
      }
      xml2js.parseString(xml, {trim: true}, function (err, result) {
        if (err) {
          err.name = 'BadMessage' + err.name;
          return next(err);
        }
        var xml = formatMessage(result.xml);
        var encryptMessage = xml.Encrypt;
        if (signature !== cryptor.getSignature(timestamp, nonce, encryptMessage)) {
          res.writeHead(401);
          res.end('Invalid signature');
          return;
        }
        var decrypted = cryptor.decrypt(encryptMessage);
        var messageWrapXml = decrypted.message;
        if (messageWrapXml === '') {
          res.writeHead(401);
          res.end('Invalid appid');
          return;
        }
        req.weixin_xml = messageWrapXml;
        xml2js.parseString(messageWrapXml, {trim: true}, function (err, result) {
          if (err) {
            err.name = 'BadMessage' + err.name;
            return next(err);
          }
          req.weixin = formatMessage(result.xml);
          _respond(req, res, next);
        });
      });
    });
  } else {
    res.writeHead(501);
    res.end('Not Implemented');
  }
};

/**
 * 根据Handler对象生成响应方法，并最终生成中间件函数
 */
Handler.prototype.middlewarify = function () {
  var that = this;
  if (this.encodingAESKey) {
    that.cryptor = new WXBizMsgCrypt(this.token, this.encodingAESKey, this.appid);
  }
  var token = this.token;
  var _respond = respond(this);
  return function (req, res, next) {
    // 如果已经解析过了，调用相关handle处理
    if (req.weixin) {
      _respond(req, res, next);
      return;
    }
    if (req.query.encrypt_type && req.query.msg_signature) {
      serveEncrypt(that, req, res, next, _respond);
    } else {
      var method = req.method;
      // 动态token，在前置中间件中设置该值req.wechat_token，优先选用
      if (!checkSignature(req.query, req.wechat_token || token)) {
        res.writeHead(401);
        res.end('Invalid signature');
        return;
      }
      if (method === 'GET') {
        res.writeHead(200);
        res.end(req.query.echostr);
      } else if (method === 'POST') {
        getMessage(req, function (err, result) {
          if (err) {
            err.name = 'BadMessage' + err.name;
            return next(err);
          }
          req.weixin = formatMessage(result.xml);
          _respond(req, res, next);
        });
      } else {
        res.writeHead(501);
        res.end('Not Implemented');
      }
    }
  };
};

/**
 * 根据口令
 *
 * Examples:
 * 使用wechat作为自动回复中间件的三种方式
 * ```
 * wechat(token, function (req, res, next) {});
 *
 * wechat(token, wechat.text(function (message, req, res, next) {
 *   // TODO
 * }).location(function (message, req, res, next) {
 *   // TODO
 * }));
 *
 * wechat(token)
 *   .text(function (message, req, res, next) {
 *     // TODO
 *   }).location(function (message, req, res, next) {
 *    // TODO
 *   }).middlewarify();
 * ```
 * 加密模式下token为config
 *
 * ```
 * var config = {
 *  token: 'token',
 *  appid: 'appid',
 *  encodingAESKey: 'encodinAESKey'
 * };
 * wechat(config, function (req, res, next) {});
 * ```
 *
 * 静态方法
 *
 * - `text`，处理文字推送的回调函数，接受参数为(text, req, res, next)。
 * - `image`，处理图片推送的回调函数，接受参数为(image, req, res, next)。
 * - `voice`，处理声音推送的回调函数，接受参数为(voice, req, res, next)。
 * - `video`，处理视频推送的回调函数，接受参数为(video, req, res, next)。
 * - `location`，处理位置推送的回调函数，接受参数为(location, req, res, next)。
 * - `link`，处理链接推送的回调函数，接受参数为(link, req, res, next)。
 * - `event`，处理事件推送的回调函数，接受参数为(event, req, res, next)。
 * - `shortvideo`，处理短视频推送的回调函数，接受参数为(event, req, res, next)。
 * @param {String} token 在微信平台填写的口令
 * @param {Function} handle 生成的回调函数，参见示例
 */
var middleware = function (token, handle) {
  if (arguments.length === 1) {
    return new Handler(token);
  }

  if (handle instanceof Handler) {
    handle.setToken(token);
    return handle.middlewarify();
  } else {
    return new Handler(token, handle).middlewarify();
  }
};

['text', 'image', 'voice', 'video', 'shortvideo', 'location', 'link', 'event'].forEach(function (method) {
  middleware[method] = function (fn) {
    return (new Handler())[method](fn);
  };
});

middleware.toXML = compiled;
middleware.reply = reply;
middleware.reply2CustomerService = reply2CustomerService;
middleware.checkSignature = checkSignature;

module.exports = middleware;
