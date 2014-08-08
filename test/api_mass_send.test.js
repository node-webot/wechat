var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var config = require('./config');
var API = require('../').API;

var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';
var imageId = 'XDZxzuRWBPqI4R9n_nNR5uRVZVQCSneMoELyWKflwM2qF9K38vnVFzgaD97uCTUu';
var movieId = 'b4F8SfaZZQwalDxwPjd923ACV5IUeYvZ9-dYKf5ytXrS-IImXEkl2U8Fl5EH-jCF';

describe('api_mass_send.js', function () {
  var api = new API(config.appid, config.appsecret);
  before(function (done) {
    api.getAccessToken(function (err, token) {
      api.token = token;
      done(err);
    });
  });

  describe('_uploadNews', function () {
    var news = {
      "articles": [
        {
          "thumb_media_id": imageId,
          "author":"xxx",
          "title":"Happy Day",
          "content_source_url":"www.qq.com",
          "content":"content",
          "digest":"digest",
          "show_cover_pic":"1"
        }
      ]
    };

    describe('mock _uploadNews ok', function () {
      before(function () {
        muk(urllib, 'request', function (url, opts, callback) {
          process.nextTick(function () {
            callback(new Error('mock invalid media_id'));
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('_uploadNews should ok', function (done) {
        api._uploadNews(news, function (err, data) {
          expect(err).to.be.ok();
          expect(err).to.have.property('message', 'mock invalid media_id');
          done();
        });
      });
    });


    describe('mock _uploadNews ok', function () {
      before(function () {
        muk(urllib, 'request', function (url, opts, callback) {
          process.nextTick(function () {
            callback(new Error('mock invalid media_id'));
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('uploadNews should ok', function (done) {
        api.uploadNews(news, function (err, data) {
          expect(err).to.be.ok();
          expect(err).to.have.property('message', 'mock invalid media_id');
          done();
        });
      });
    });

    describe('mock _uploadNews ok', function () {
      before(function () {
        muk(urllib, 'request', function (url, opts, callback) {
          var data = {
            "type":"news",
            "media_id":"CsEf3ldqkAYJAU6EJeIkStVDSvffUJ54vqbThMgplD-VJXXof6ctX5fI6-aYyUiQ",
            "created_at":1391857799
          };
          process.nextTick(function () {
            callback(null, data);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api._uploadNews(news, function (err, data) {
          expect(err).to.not.be.ok();
          expect(data).to.only.have.keys('type', 'media_id', 'created_at');
          done();
        });
      });
    });
  });

  describe('mock', function () {
    before(function () {
      muk(api, 'massSend', function (opts, receivers, callback) {
        var data = {
          "errcode": 0,
          "errmsg": "send job submission success",
          "msg_id": 34182
        };
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
    it('send to openids should ok', function (done) {
      api.massSendText('群发消息', [puling], function (err, data) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'send job submission success');
        expect(data).to.have.property('msg_id');
        done();
      });
    });

    it('send to group should ok', function (done) {
      api.massSendText('群发消息', 'groupid', function (err, data) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'send job submission success');
        expect(data).to.have.property('msg_id');
        done();
      });
    });
  });

  describe('massSendText', function () {
    it('should ok', function (done) {
      api.massSendText('群发消息', [puling], function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('massSendImage', function () {
    it('should ok', function (done) {
      api.massSendImage(imageId, [puling], function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('deleteMass', function () {
    it('should ok', function (done) {
      api.deleteMass('messageId', function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('code', -1);
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('massSendVoice', function () {
    it('should ok', function (done) {
      api.massSendVoice('media_id', [puling], function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('massSendVideo', function () {
    it('should ok', function (done) {
      var opts = {
        media_id: 'media_id',
        title: 'title',
        description: 'description'
      };
      api.massSendVideo(opts, [puling], function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('massSendMPVideo', function () {
    describe('mock err', function () {
      before(function () {
        muk(api, 'preRequest', function (method, args) {
          var callback = args[args.length - 1];
          process.nextTick(function () {
            callback(new Error('mock error'));
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        var opts = {
          "media_id": movieId,
          "title": "TITLE",
          "description": "Description"
        };
        api.massSendMPVideo(opts, [puling], function (err, data) {
          expect(err).to.be.ok();
          expect(err).to.have.property('message', 'mock error');
          done();
        });
      });
    });

    describe('mock', function () {
      before(function () {
        muk(api, 'uploadMPVideo', function (opts, callback) {
          process.nextTick(function () {
            callback(null, {
              "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
              "title": "TITLE",
              "description": "Description"
            });
          });
        });
      });

      after(function () {
        muk.restore();
      });
      it('send to openids should ok', function (done) {
        var opts = {
          "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
          "title": "TITLE",
          "description": "Description"
        };
        api.massSendMPVideo(opts, [puling], function (err, data) {
          expect(err).to.be.ok();
          expect(err).to.have.property('message', 'api unauthorized');
          done();
        });
      });
    });
  });

  describe('massSendNews', function () {
    it('should ok', function (done) {
      api.massSendNews('media id', [puling], function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });

    it('should ok with groupid', function (done) {
      api.massSendNews('media id', 'invalid groupid', function (err, data) {
        expect(err).to.be.ok();
        expect(err).to.have.property('code', 40050);
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('uploadMPVideo', function () {
    describe('mock err', function () {
      before(function () {
        muk(urllib, 'request', function (url, opts, callback) {
          process.nextTick(function () {
            callback(new Error('mock err'));
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        var opts = {
          "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
          "title": "TITLE",
          "description": "Description"
        };
        api.uploadMPVideo(opts, function (err, data) {
          expect(err).to.be.ok();
          expect(err).to.have.property('message', 'mock err');
          done();
        });
      });
    });
  });
});
