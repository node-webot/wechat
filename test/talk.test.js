var should = require('should');

var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;

var connect = require('connect');
var wechat = require('../');

var List = require('../').List;

var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use('/wechat', wechat('some token', wechat.text(function (info, req, res, next) {
  if (info.Content === 'list') {
    res.wait('view', function (err) {
      should.not.exist(err);
    });
  } else if (info.Content === 'undefinedlist') {
    res.wait('undefined', function (err) {
      should.exist(err);
    });
  } else {
    res.reply('hehe');
  }
})));

describe('wechat.js', function () {
  before(function () {
    List.add('view', [
      ['回复{a}查看我的性别', function (info, req, res) {
        res.reply('我是个妹纸哟');
      }],
      ['回复{b}查看我的年龄', function (info, req, res) {
        res.reply('我今年18岁');
      }],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -'],
      ['回复{nowait}退出问答', function (info, req, res) {
        res.nowait('thanks');
      }]
    ]);
  });

  describe('talk', function () {
    it('should reply hehe when not trigger the list', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'a'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<Content><![CDATA[hehe]]></Content>');
        done();
      });
    });

    it('should reply the list when trigger the list', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'list'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<Content><![CDATA[回复a查看我的性别\n回复b查看我的年龄\n回复c查看我的性取向\n回复nowait退出问答]]></Content>');
        done();
      });
    });

    it('should reply with list', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'a'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<Content><![CDATA[我是个妹纸哟]]></Content>');
        done();
      });
    });

    it('should reply with list also', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'b'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<Content><![CDATA[我今年18岁]]></Content>');
        done();
      });
    });

    it('should reply with text', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'c'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<Content><![CDATA[这样的事情怎么好意思告诉你啦- -]]></Content>');
        done();
      });
    });

    it('should reply with default handle', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'd'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<Content><![CDATA[hehe]]></Content>');
        done();
      });
    });

    it('should reply 500 when undefined list', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'undefinedlist'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(500)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('UndefinedListError');
        done();
      });
    });

    it('should reply 500 when undefined list', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: 'nowait'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('thanks');
        done();
      });
    });
  });
});
