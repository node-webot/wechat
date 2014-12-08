require('should');
var querystring = require('querystring');
var request = require('supertest');

var tail = function (token, message, get) {
  var q = {
    timestamp: new Date().getTime(),
    encrypt_type: 'aes',
    nonce: parseInt((Math.random() * 100000000000), 10)
  };
  if (get) {
    q.echostr = message;
  }
  var s = [token, q.timestamp, q.nonce, message].sort().join('');
  q.msg_signature = require('crypto').createHash('sha1').update(s).digest('hex');
  return querystring.stringify(q);
};

var tpl = '<xml>' +
  '<ToUserName><![CDATA[<%-toUser%>]]></ToUserName>' +
  '<Encrypt><![CDATA[<%-msg_encrypt%>]]></Encrypt>' +
'</xml>';

var template = require('ejs').compile(tpl);

var postData = function (token, message) {
  var q = {
    timestamp: new Date().getTime(),
    nonce: parseInt((Math.random() * 100000000000), 10),
    encrypt_type: 'aes'
  };

  var s = [token, q.timestamp, q.nonce, message].sort().join('');
  var signature = require('crypto').createHash('sha1').update(s).digest('hex');
  q.msg_signature = signature;


  var info = {
    msg_encrypt: message,
    toUser: 'user'
  };

  return {
    xml: template(info),
    querystring: querystring.stringify(q)
  };
};

var connect = require('connect');
var wechat = require('../');
var WXBizMsgCrypt = require('wechat-crypto');

var app = connect();
app.use(connect.query());
var cfg = {
  token: 'some token',
  appid: 'appid',
  encodingAESKey: 'SvFHaQqrlAhRud3ye6f8ujJsR2LeYbxzPPIzNlei2FX'
};

app.use('/wechat', wechat(cfg, function (req, res, next) {
  res.reply('hehe');
}));

describe('wechat_encrypted.js', function () {
  var cryptor = new WXBizMsgCrypt(cfg.token, cfg.encodingAESKey, cfg.appid);

  describe('get', function () {
    it('should ok', function (done) {
      var echoStr = 'node rock';
      var _tail = tail(cfg.token, cryptor.encrypt(echoStr), true);
      request(app)
        .get('/wechat?' + _tail)
        .expect(200)
        .expect(echoStr, done);
    });

    it('should not ok', function (done) {
      var echoStr = 'node rock';
      var _tail = tail('fake_token', cryptor.encrypt(echoStr), true);
      request(app)
        .get('/wechat?' + _tail)
        .expect(401)
        .expect('Invalid signature', done);
    });
  });

  describe('post', function () {
    it('should 500', function (done) {
      request(app)
      .post('/wechat?' + tail(cfg.token, cryptor.encrypt(''), false))
      .expect(500)
      .expect(/body is empty/, done);
    });

    it('should 401 invalid signature', function (done) {
      var xml = '<xml></xml>';
      var data = postData('fake_token', cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(401)
      .expect('Invalid signature', done);
    });

    it('should 200', function (done) {
      var xml = '<xml></xml>';
      var data = postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200, done);
    });
  });

  describe('put', function () {
    it('should 500', function (done) {
      request(app)
      .put('/wechat?' + tail(cfg.token, cryptor.encrypt(''), false))
      .expect(501)
      .expect(/Not Implemented/, done);
    });
  });
});
