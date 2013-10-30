var should = require('should');
var urllib = require('urllib');
var muk = require('muk');
var API = require('../').API;

describe('common.js', function () {
  describe('getAccessToken', function () {
    var api = new API('appid', 'secret');

    it('should not ok', function (done) {
      api.getAccessToken(function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    describe('mock urllib err', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var err = new Error('Urllib Error');
          err.name = 'UrllibError';
          callback(err);
        });
      });

      after(function () {
        muk.restore();
      });

      it('should get mock error', function (done) {
        api.getAccessToken(function (err, token) {
          should.exist(err);
          err.name.should.be.equal('WeChatAPIUrllibError');
          err.message.should.be.equal('Urllib Error');
          done();
        });
      });
    });

    describe('mock token', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          process.nextTick(function () {
            callback(null, {"access_token": "ACCESS_TOKEN","expires_in": 7200});
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.getAccessToken(function (err, token) {
          should.not.exist(err);
          token.should.have.property('access_token', 'ACCESS_TOKEN');
          token.should.have.property('expires_in', 7200);
          done();
        });
      });
    });
  });

  describe('invalid token', function () {
    var api = new API('appid', 'secret');
    before(function (done) {
      api.getAccessToken(function (err) {
        done();
      });
    });

    it('createMenu should not ok', function (done) {
      api.createMenu('{}', function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('getMenu should not ok', function (done) {
      api.getMenu(function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('removeMenu should not ok', function (done) {
      api.removeMenu(function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('getQRCode should not ok', function (done) {
      var ticket = {"expire_seconds": 1800, "action_name": "SCAN_SCENE", "action_info": {"scene": {"scene_id": 123}}};
      api.getQRCode(ticket, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('createTmpQRCode should not ok', function (done) {
      api.createTmpQRCode(123, 1800, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('createLimitQRCode should not ok', function (done) {
      api.createLimitQRCode(123, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('showQRCodeURL should not ok', function () {
      api.showQRCodeURL('ticket').should.be.equal('https://api.weixin.qq.com/cgi-bin/showqrcode?ticket=ticket');
    });

    it('getGroups should not ok', function (done) {
      api.getGroups(function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('createGroup should not ok', function (done) {
      api.createGroup('new group', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('updateGroup should not ok', function (done) {
      api.updateGroup(123, 'new group', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('moveUserToGroup should not ok', function (done) {
      api.moveUserToGroup('openid', 123, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('getUser should not ok', function (done) {
      api.getUser('openid', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('getFollowers should not ok', function (done) {
      api.getFollowers(function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('getFollowers with nextOpenId should not ok', function (done) {
      api.getFollowers('openid', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('sendText should not ok', function (done) {
      api.sendText('openid', 'Hellow World', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('sendImage should not ok', function (done) {
      api.sendImage('openid', 'imageId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('sendVideo should not ok', function (done) {
      api.sendVideo('openid', 'mediaId', 'thumbMediaId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('sendMusic should not ok', function (done) {
      var music = {
        "title":"MUSIC_TITLE", // 可选
        "description":"MUSIC_DESCRIPTION", // 可选
        "musicurl":"MUSIC_URL",
        "hqmusicurl":"HQ_MUSIC_URL",
        "thumb_media_id":"THUMB_MEDIA_ID" 
      };

      api.sendMusic('openid', music, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('sendNews should not ok', function (done) {
      var articles = [
        {
          "title":"Happy Day",
          "description":"Is Really A Happy Day",
          "url":"URL",
          "picurl":"PIC_URL"
        }
      ];

      api.sendNews('openid', articles, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });
  });

  describe('mock', function () {
    
  });
});
