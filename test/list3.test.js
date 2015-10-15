require('should');
var List = require('../').List;

var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;

var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use('/wechat', wechat('some token', function (req, res, next) {
  // 微信输入信息都在req.weixin上

  var info = req.weixin;
  if (info.Content === 'list') {
    List.add('dynamicview', [
      ['回复{c}查看又什么惊喜', function(info,req,res,next,value){
        res.reply(value);
      },'GOGOGO']
    ],'','','',req);
    res.wait('dynamicview');
  }
}));

describe('list3', function() {
  it('should ok with list to run in multiple instance', function (done) {
    var info = {
      sp: 'test',
      user: 'test',
      type: 'text',
      text: 'list'
    };

    request(app)
    .post('/wechat' + tail())
    .send(template(info))
    .expect(200)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }

      info = {
        sp: 'test',
        user: 'test',
        type: 'text',
        text: 'c'
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
        body.should.include('GOGOGO');
        done();
      });
    });
  });
});
