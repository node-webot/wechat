require('should');
var reply = require('../').reply;
var reply2CustomerService = require('../').reply2CustomerService;

describe('wechat.js', function () {
  describe('reply text', function () {
    it('reply("text") should ok', function () {
      var result = reply('hello world', 'from', 'to');
      result.should.be.include('<Content><![CDATA[hello world]]></Content>');
      result.should.be.include('<MsgType><![CDATA[text]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });

    it('reply({type: "text", content: content}) should ok', function () {
      var result = reply({type: 'text', content: 'hello world'}, 'from', 'to');
      result.should.be.include('<Content><![CDATA[hello world]]></Content>');
      result.should.be.include('<MsgType><![CDATA[text]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply music', function () {
    it('reply(object) should ok', function () {
      var result = reply({
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3"
      }, 'from', 'to');
      result.should.be.include('<Title><![CDATA[来段音乐吧]]></Title>');
      result.should.be.include('<MsgType><![CDATA[music]]></MsgType>');
      result.should.be.include('<Description><![CDATA[一无所有]]></Description>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<MusicUrl><![CDATA[http://mp3.com/xx.mp3]]></MusicUrl>');
      result.should.be.include('<HQMusicUrl><![CDATA[http://mp3.com/xx.mp3]]></HQMusicUrl>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });

    it('reply(object) with type should ok', function () {
      var result = reply({
        type: "music",
        content: {
          title: "来段音乐吧",
          description: "一无所有",
          musicUrl: "http://mp3.com/xx.mp3",
          hqMusicUrl: "http://mp3.com/xx.mp3"
        }
      }, 'from', 'to');
      result.should.be.include('<Title><![CDATA[来段音乐吧]]></Title>');
      result.should.be.include('<MsgType><![CDATA[music]]></MsgType>');
      result.should.be.include('<Description><![CDATA[一无所有]]></Description>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<MusicUrl><![CDATA[http://mp3.com/xx.mp3]]></MusicUrl>');
      result.should.be.include('<HQMusicUrl><![CDATA[http://mp3.com/xx.mp3]]></HQMusicUrl>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply news', function () {
    var news = [
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ];

    it('reply(Array) should ok', function () {
      var result = reply(news, 'from', 'to');
      result.should.be.include('<ArticleCount>1</ArticleCount>');
      result.should.be.include('<Title><![CDATA[你来我家接我吧]]></Title>');
      result.should.be.include('<Description><![CDATA[这是女神与高富帅之间的对话]]></Description>');
      result.should.be.include('<PicUrl><![CDATA[http://nodeapi.cloudfoundry.com/qrcode.jpg]]></PicUrl>');
      result.should.be.include('<Url><![CDATA[http://nodeapi.cloudfoundry.com/]]></Url>');
      result.should.be.include('<MsgType><![CDATA[news]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });

    it('reply({type: "news", content: news}) should ok', function () {
      var result = reply({type: 'news', content: news}, 'from', 'to');
      result.should.be.include('<ArticleCount>1</ArticleCount>');
      result.should.be.include('<Title><![CDATA[你来我家接我吧]]></Title>');
      result.should.be.include('<Description><![CDATA[这是女神与高富帅之间的对话]]></Description>');
      result.should.be.include('<PicUrl><![CDATA[http://nodeapi.cloudfoundry.com/qrcode.jpg]]></PicUrl>');
      result.should.be.include('<Url><![CDATA[http://nodeapi.cloudfoundry.com/]]></Url>');
      result.should.be.include('<MsgType><![CDATA[news]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply image', function () {
    var image = {
      mediaId: 'mediaId'
    };

    it('reply({type: "image", content: image}) should ok', function () {
      var result = reply({type: 'image', content: image}, 'from', 'to');
      result.should.be.include('<Image><MediaId><![CDATA[mediaId]]></MediaId></Image>');
      result.should.be.include('<MsgType><![CDATA[image]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply voice', function () {
    var voice = {
      mediaId: 'mediaId'
    };

    it('reply({type: "voice", content: voice}) should ok', function () {
      var result = reply({type: 'voice', content: voice}, 'from', 'to');
      result.should.be.include('<Voice><MediaId><![CDATA[mediaId]]></MediaId></Voice>');
      result.should.be.include('<MsgType><![CDATA[voice]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply video', function () {
    var video = {
      mediaId: 'mediaId',
      thumbMediaId: 'thumbMediaId'
    };

    it('reply({type: "video", content: video}) should ok', function () {
      var result = reply({type: 'video', content: video}, 'from', 'to');
      result.should.be.include('<Video><MediaId><![CDATA[mediaId]]></MediaId><Title><![CDATA[]]></Title><Description><![CDATA[]]></Description></Video>');
      result.should.be.include('<MsgType><![CDATA[video]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply2CustomerService', function () {
    it('reply2CustomerService', function () {
      var result = reply2CustomerService('from', 'to');
      result.should.be.include('<MsgType><![CDATA[transfer_customer_service]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
      result.should.be.not.include('<KfAccount>');
    });

    it('reply2CustomerService with kfAccount', function () {
      var result = reply2CustomerService('from', 'to', 'kf');
      result.should.be.include('<MsgType><![CDATA[transfer_customer_service]]></MsgType>');
      result.should.be.include('<ToUserName><![CDATA[to]]></ToUserName>');
      result.should.be.include('<FromUserName><![CDATA[from]]></FromUserName>');
      result.should.be.include('<KfAccount><![CDATA[kf]]></KfAccount>');
    });
  });
});
