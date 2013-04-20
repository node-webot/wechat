require('should');

var request = require('supertest');
var tail = require('./support').tail;

var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat('some token', function (req, res, next) {
  res.writeHead(200);
  res.end('hehe');
}));
app.use(function (err, req, res, next) {
  res.statusCode = err.status || 500;
  res.end(err.name);
});

describe('parse_xml.js', function () {
  it('should ok', function (done) {
    var xml = '<xml><ToUserName><![CDATA[gh_d3e07d51b513]]></ToUserName><FromUserName><![CDATA[oPKu7jgOibOA-De4u8J2RuNKpZRw]]></FromUserName><CreateTime>1361374891</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[/:8-)]]></Content><MsgId>5847060634540564918</MsgId></xml>';

    request(app)
    .post('/wechat' + tail())
    .send(xml)
    .expect(200)
    .expect('hehe')
    .end(done);
  });

  it('should not ok when bad xml', function (done) {
    var xml = '<xml><badToUserName><![CDATA[gh_d3e07d51b513]]></ToUserName><FromUserName><![CDATA[oPKu7jgOibOA-De4u8J2RuNKpZRw]]></FromUserName><CreateTime>1361374891</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[/:8-)]]></Content><MsgId>5847060634540564918</MsgId></xml>';

    request(app)
    .post('/wechat' + tail())
    .send(xml)
    .expect(500)
    .expect('BadMessageError')
    .end(done);
  });
});
