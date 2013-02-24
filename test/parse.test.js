require('should');

var querystring = require('querystring');
var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;

var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat('some token', function (req, res, next) {
  res.writeHead(200);
  res.end('hehe');
}));

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
});
