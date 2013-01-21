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
    '<MsgType><![CDATA[<%-msgType%>]]></MsgType>',
    '<Content><![CDATA[<%-content%>]]></Content>',
    '<FuncFlag><%=funcFlag%></FuncFlag>',
  '</xml>'].join('');
var respond = function (callback) {
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
          req.weixin = weixin;
          res.reply = function (info) {
            info = info || {};
            info.createTime = new Date().getTime();
            info.funcFlag = info.funcFlag || 0;
            info.toUsername = req.weixin.FromUserName;
            info.fromUsername = req.weixin.ToUserName;

            res.writeHead(200);
            res.end(ejs.render(tpl, info));
          };
          callback(req, res, next);
        });
      } else {
        res.writeHead(400);
        res.end('Empty Post');
      }
    });
  };
};

module.exports = function (token, callback) {
  var _valid = valid(token);
  var _respond = respond(callback);
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
