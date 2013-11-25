require('should');

var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;

var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat('some token', wechat.text(function (message, req, res, next) {
  res.end('hehe');
})));
app.use('/wechat', function (req, res, next) {
  res.end('next');
});

describe('no handler', function () {
  describe('respond', function () {
    it('should ok', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'hehe',
        text: '测试中'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) {
          return done(err);
        }
        var body = res.text.toString();
        body.should.include('next');
        done();
      });
    });
  });
});
