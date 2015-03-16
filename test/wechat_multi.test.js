require('should');

var querystring = require('querystring');
var request = require('supertest');

var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat('some token', function (req, res, next) {
  next();
}));
app.use('/wechat', wechat('some token', function (req, res, next) {
  // 微信输入信息都在req.weixin上
  res.reply('hehe');
}));

describe('wechat.js', function () {

  it('multi wechat should ok', function (done) {
    var q = {
      timestamp: new Date().getTime(),
      nonce: parseInt((Math.random() * 10e10), 10)
    };
    var s = ['some token', q.timestamp, q.nonce].sort().join('');
    q.signature = require('crypto').createHash('sha1').update(s).digest('hex');
    q.echostr = 'hehe';
    request(app)
    .get('/wechat?' + querystring.stringify(q))
    .expect(200)
    .expect('hehe', done);
  });
});
