var connect = require('connect');
var wechat = require('../');
var querystring = require('querystring');
var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;
require('should');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat('some token').text(function (message, req, res, next) {
  // 微信输入信息都在message上
  // 回复屌丝(普通回复)
  if (message.FromUserName === 'diaosi') {
    res.reply('hehe');
  } else if (message.FromUserName === 'hehe') {
    res.reply({
      title: "来段音乐吧",
      description: "一无所有",
      musicUrl: "http://mp3.com/xx.mp3",
      hqMusicUrl: "http://mp3.com/xx.mp3"
    });
  } else {
  // 回复高富帅(图文回复)
    res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }
}).location(function (message, req, res, next) {
  res.reply('location');
}).image(function (message, req, res, next) {
  res.reply('image');
}).voice(function (message, req, res, next) {
  res.reply('voice');
}).link(function (message, req, res, next) {
  res.reply('link');
}).event(function (message, req, res, next) {
  res.reply('event');
}).middlewarify());

describe('wechat.js 0.3.0', function () {

  describe('valid GET', function () {
    it('should 401', function (done) {
      request(app)
      .get('/wechat')
      .expect(401)
      .expect('Invalid signature', done);
    });

    it('should 200', function (done) {
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

    it('should 401 invalid signature', function (done) {
      var q = {
        timestamp: new Date().getTime(),
        nonce: parseInt((Math.random() * 10e10), 10)
      };
      q.signature = 'invalid_signature';
      q.echostr = 'hehe';
      request(app)
      .get('/wechat?' + querystring.stringify(q))
      .expect(401)
      .expect('Invalid signature', done);
    });
  });

  describe('valid POST', function () {
    it('should 401', function (done) {
      request(app)
      .post('/wechat')
      .expect(401)
      .expect('Invalid signature', done);
    });

    it('should 401 invalid signature', function (done) {
      var q = {
        timestamp: new Date().getTime(),
        nonce: parseInt((Math.random() * 10e10), 10)
      };
      q.signature = 'invalid_signature';
      q.echostr = 'hehe';
      request(app)
      .post('/wechat?' + querystring.stringify(q))
      .expect(401)
      .expect('Invalid signature', done);
    });
  });

  describe('respond', function () {
    it('should ok', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: '测试中'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[hehe]]></Content>');
        done();
      });
    });

    it('should ok with news', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'gaofushuai',
        type: 'text',
        text: '测试中'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[gaofushuai]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[news]]></MsgType>');
        body.should.include('<ArticleCount>1</ArticleCount>');
        body.should.include('<Title><![CDATA[你来我家接我吧]]></Title>');
        body.should.include('<Description><![CDATA[这是女神与高富帅之间的对话]]></Description>');
        body.should.include('<PicUrl><![CDATA[http://nodeapi.cloudfoundry.com/qrcode.jpg]]></PicUrl>');
        body.should.include('<Url><![CDATA[http://nodeapi.cloudfoundry.com/]]></Url>');
        done();
      });
    });

    it('should ok when image', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'image',
        pic: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[image]]></Content>');
        done();
      });
    });

    it('should ok when location', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'location',
        xPos: 'xPos',
        yPos: 'yPos',
        scale: '100',
        label: 'label'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[location]]></Content>');
        done();
      });
    });

    it('should ok when voice', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'voice',
        mediaId: 'id',
        format: 'format'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[voice]]></Content>');
        done();
      });
    });

    it('should ok when link', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'link',
        title: 'good link',
        description: '1024',
        url: 'http://where.is.caoliu/'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[link]]></Content>');
        done();
      });
    });

    it('should ok when event location', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'event',
        event: 'LOCATION',
        latitude: '23.137466',
        longitude: '113.352425',
        precision: '119.385040'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[event]]></Content>');
        done();
      });
    });

    it('should ok when event enter', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'event',
        event: 'ENTER'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<ToUserName><![CDATA[diaosi]]></ToUserName>');
        body.should.include('<FromUserName><![CDATA[nvshen]]></FromUserName>');
        body.should.match(/<CreateTime>\d{13}<\/CreateTime>/);
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[event]]></Content>');
        done();
      });
    });

    it('should ok reply text', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'diaosi',
        type: 'text',
        text: '测试中'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<MsgType><![CDATA[text]]></MsgType>');
        body.should.include('<Content><![CDATA[hehe]]></Content>');
        done();
      });
    });

    it('should ok reply news', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'gaofushuai',
        type: 'text',
        text: '测试中'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<MsgType><![CDATA[news]]></MsgType>');
        body.should.include('<ArticleCount>1</ArticleCount>');
        body.should.include('<Title><![CDATA[你来我家接我吧]]></Title>');
        body.should.include('<Description><![CDATA[这是女神与高富帅之间的对话]]></Description>');
        body.should.include('<PicUrl><![CDATA[http://nodeapi.cloudfoundry.com/qrcode.jpg]]></PicUrl>');
        body.should.include('<Url><![CDATA[http://nodeapi.cloudfoundry.com/]]></Url>');
        done();
      });
    });

    it('should ok reply music', function (done) {
      var info = {
        sp: 'nvshen',
        user: 'hehe',
        type: 'text',
        text: '测试中'
      };

      request(app)
      .post('/wechat' + tail())
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        body.should.include('<MsgType><![CDATA[music]]></MsgType>');
        body.should.include('<Title><![CDATA[来段音乐吧]]></Title>');
        body.should.include('<Description><![CDATA[一无所有]]></Description>');
        body.should.include('<MusicUrl><![CDATA[http://mp3.com/xx.mp3]]></MusicUrl>');
        body.should.include('<HQMusicUrl><![CDATA[http://mp3.com/xx.mp3]]></HQMusicUrl>');
        done();
      });
    });
  });
});
