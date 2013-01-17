/**
 * @property {String} tpl XML模版
 */
var tpl = [
  '<xml>',
    '<ToUserName><![CDATA[<%=sp%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%=user%>]]></FromUserName>',
    '<CreateTime><%=(new Date().getTime())%></CreateTime>',
    '<MsgType><![CDATA[<%=type%>]]></MsgType>',
    '<% if(type=="text"){ %>',
      '<Content><![CDATA[<%=text%>]]></Content>',
    '<% }else if(type=="location"){  %>',
      '<Location_X><%=xPos%></Location_X>',
      '<Location_Y><%=yPos%></Location_Y>',
      '<Scale>{<%=scale%>}</Scale>',
      '<Label><![CDATA[<%=label%>]]></Label>',
    '<% }else if(type=="image"){  %>',
      '<PicUrl><![CDATA[<%=pic%>]]></PicUrl>',
    '<% } %>',
  '</xml>'
].join('');

var querystring = require('querystring');
var request = require('supertest');
var ejs = require('ejs');

describe('wechat.js', function () {
  var app = require('./app');

  describe('valid', function () {
    it('should 401', function (done) {
      request(app)
      .get('/wechat')
      .expect(401)
      .expect('sorry', done);
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
      var s = ['some token', q.timestamp, q.nonce].sort().join('');
      q.signature = 'invalid_signature';
      q.echostr = 'hehe';
      request(app)
      .get('/wechat?' + querystring.stringify(q))
      .expect(401)
      .expect('sorry', done);
    });
  });

  describe('respond', function () {
    it('should not ok', function (done) {
      var info = {
        sp: 'webot',
        user: 'client',
        type: 'text',
        text: 'help',
        pic: 'http://www.baidu.com/img/baidu_sylogo1.gif',
        scale: '20',
        label: 'this is a location'
      };

      request(app)
      .post('/wechat')
      .send(ejs.render(tpl, info))
      .expect(200)
      .expect('<xml>       <ToUserName><![CDATA[diaosi]]></ToUserName>       <FromUserName><![CDATA[nvshen]]></FromUserName>       <CreateTime>1358453451281</CreateTime>       <MsgType><![CDATA[text]]></MsgType>       <Content><![CDATA[测试中]]></Content>       <FuncFlag>0</FuncFlag>     </xml>', done);
    });
  });
});
