var crypto = require('crypto');
var xml2js = require('xml2js');
var ejs = require('ejs');

exports.valid = function (token, handle) {
  var checkSignature = function (query) {
    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));

    return shasum.digest('hex') === signature;
  };

  return function (req, res, next) {
    if (checkSignature(req.query)) {
      res.writeHead(200);
      res.end(req.query.echostr);
    } else {
      res.writeHead(401);
      res.end('sorry');
    }
  };
};

exports.respond = function (callback) {
  var parser = new xml2js.Parser();
  var tpl = '<xml>
      <ToUserName><![CDATA[<%=toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%=fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[<%=msgType%>]]></MsgType>
      <Content><![CDATA[<%=content%>]]></Content>
      <FuncFlag><%=funcFlag%></FuncFlag>
    </xml>';
  return function (req, res, next) {
    var buf = new BufferHelper();
    req.on('data', function (chunk) {
      buf.concat(chunk);
    });
    req.on('end', function () {
      var xml = buf.toString('utf-8');
      if (!xml) {
        parser.parseString(xml, function (err, result) {
          if (err) return next(err);
          req.weixin = result;
          callback(req, function (err, data) {
            if (err) return next(err);
            data.createTime = new Date().getTime();
            data.funcFlag = data.funcFlag || 0;
            res.writeHead(200);
            res.end(ejs.render(tpl, data));
          });
        });
      } else {
        res.writeHead(400);
        res.end('Empty Post');
      }
    });
  };
};