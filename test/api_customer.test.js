var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';
var imageId = 'XDZxzuRWBPqI4R9n_nNR5uRVZVQCSneMoELyWKflwM2qF9K38vnVFzgaD97uCTUu';
var voiceId = '9R5BhAum7AEaGhwku0WhgvtO4C_7Xs78NoiRvm6v7IyoTljE4HH5o8E_UfnPrL0p';
var thumbId = 'BHxGDVy7WY6BCOcv3AwbywUE630Vw0tAV_V8bzBaCZid4Km5fwXrVOso3X0zas4n';
var movieId = 'b4F8SfaZZQwalDxwPjd923ACV5IUeYvZ9-dYKf5ytXrS-IImXEkl2U8Fl5EH-jCF';

describe('api_customer', function () {
  var api = new API(config.appid, config.appsecret);
  var mockError = function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = {"errcode":1, "errmsg":"mock error"};
        var res =  {
          headers: {
            'content-type': 'application/json'
          }
        };
        process.nextTick(function () {
          callback(null, data, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });
  };

  describe('sendText', function () {
    it('sendText should ok', function (done) {
      api.sendText(puling, 'Hello World', function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err).to.have.property('message', 'response out of time limit');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        api.sendText(puling, 'Hellow World', function (err, data) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });

  describe('sendImage', function () {
    it('sendImage should ok', function (done) {
      api.sendImage(puling, imageId, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          // expect(err).to.have.property('message', 'response out of time limit');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        api.sendImage(puling, imageId, function (err, data) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });

  describe('sendVoice', function () {
    it('sendVoice should ok', function (done) {
      api.sendVoice(puling, voiceId, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err).to.have.property('message', 'response out of time limit');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        api.sendVoice(puling, voiceId, function (err, data) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });

  describe('sendVideo', function () {
    it('sendVideo should ok', function (done) {
      api.sendVideo(puling, voiceId, thumbId, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err).to.have.property('message', 'invalid media_id');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        api.sendVideo(puling, voiceId, thumbId, function (err, data) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });

  describe('sendMusic', function () {
    var music = {
      title: '音乐标题', // 可选
      description: '描述内容', // 可选
      musicurl: 'http://url.cn/xxx', // 音乐文件地址
      hqmusicurl: "HQ_MUSIC_URL",
      thumb_media_id: "THUMB_MEDIA_ID"
    };

    it('sendMusic should ok', function (done) {
      api.sendMusic(puling, music, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err).to.have.property('message', 'invalid media_id');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        api.sendMusic(puling, music, function (err, data) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });

  describe('sendNews', function () {
    var articles = [
      {
        "title":"Happy Day",
        "description":"Is Really A Happy Day",
        "url":"URL",
        "picurl":"PIC_URL"
      },
      {
        "title":"Happy Day",
        "description":"Is Really A Happy Day",
        "url":"URL",
        "picurl":"PIC_URL"
      }
    ];

    it('sendMusic should ok', function (done) {
      api.sendNews(puling, articles, function (err, data, res) {
        if (!err) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
        } else {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIError');
          expect(err).to.have.property('message', 'invalid media_id');
        }
        done();
      });
    });

    describe('mock err', function () {
      mockError();

      it('should not ok', function (done) {
        api.sendNews(puling, articles, function (err, data) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIError');
          expect(err.message).to.be('mock error');
          done();
        });
      });
    });
  });
});
