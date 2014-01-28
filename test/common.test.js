var should = require('should');
var urllib = require('urllib');
var muk = require('muk');
var path = require('path');
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

  describe('isAccessTokenValid', function () {
    var api = new API('appid', 'secret');
    it('should invalid', function () {
      api.isAccessTokenValid().should.be.equal(false);
    });

    it('should valid', function () {
      api.token = 'token';
      api.expireTime = new Date().getTime() + 7200 * 1000;
      api.isAccessTokenValid().should.be.equal(true);
    });
  });

  describe('invalid token', function () {
    var api = new API('appid', 'secret');
    var isAccessTokenValid = api.isAccessTokenValid;
    before(function () {
      api.isAccessTokenValid = function () {
        return true;
      };
    });

    after(function () {
      api.isAccessTokenValid = isAccessTokenValid;
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
      api.showQRCodeURL('ticket').should.be.equal('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=ticket');
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

    it('sendVoice should not ok', function (done) {
      api.sendVoice('openid', 'imageId', function (err, data, res) {
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

    describe('upload media', function () {
      ['Image', 'Voice', 'Video', 'Thumb'].forEach(function (method) {
        before(function () {
          muk(urllib, 'request', function (url, args, callback) {
            var resp = {
              "type":"image",
              "media_id":"usr5xL_gcxapoRjwH3bQZw_zKvcXL-DU4tRJtLtrtN71-3bXL52p3xX63ebp7tqA",
              "created_at":1383233542
            };
            process.nextTick(function () {
              callback(null, resp);
            });
          });
        });

        after(function () {
          muk.restore();
        });
        it('upload' + method + ' should ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/image.jpg'), function (err, data, res) {
            should.not.exist(err);
            data.should.have.property('type', 'image');
            data.should.have.property('media_id');
            data.should.have.property('created_at');
            done();
          });
        });

        it('upload' + method + ' should not ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/inexist.jpg'), function (err, data, res) {
            should.exist(err);
            err.should.have.property('name', 'Error');
            err.should.have.property('code', 'ENOENT');
            done();
          });
        });
      });
    });

    describe('get media with buffer', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var buffer = new Buffer('Hello world!');
          var res =  {
            headers: {
              'content-type': 'image/jpeg'
            }
          };
          process.nextTick(function () {
            callback(null, buffer, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('getMedia with buffer', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.not.exist(err);
          data.toString().should.be.equal('Hello world!');
          done();
        });
      });
    });

    describe('get media with json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = JSON.stringify({"errcode":40007, "errmsg":"invalid media_id"});
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
      it('getMedia with json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'WeChatAPIError');
          err.should.have.property('message', 'invalid media_id');
          done();
        });
      });
    });

    describe('get media with err json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = '{"errcode":40007, "errmsg":"invalid media_id"';
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
      it('getMedia with err json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'SyntaxError');
          done();
        });
      });
    });
  });

  describe('invalid appid', function () {
    var api = new API('appid', 'secret');

    it('createMenu should not ok', function (done) {
      api.createMenu('{}', function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getMenu should not ok', function (done) {
      api.getMenu(function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('removeMenu should not ok', function (done) {
      api.removeMenu(function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getQRCode should not ok', function (done) {
      var ticket = {"expire_seconds": 1800, "action_name": "SCAN_SCENE", "action_info": {"scene": {"scene_id": 123}}};
      api.getQRCode(ticket, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('createTmpQRCode should not ok', function (done) {
      api.createTmpQRCode(123, 1800, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('createLimitQRCode should not ok', function (done) {
      api.createLimitQRCode(123, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('showQRCodeURL should not ok', function () {
      api.showQRCodeURL('ticket').should.be.equal('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=ticket');
    });

    it('getGroups should not ok', function (done) {
      api.getGroups(function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('createGroup should not ok', function (done) {
      api.createGroup('new group', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('updateGroup should not ok', function (done) {
      api.updateGroup(123, 'new group', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('moveUserToGroup should not ok', function (done) {
      api.moveUserToGroup('openid', 123, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getUser should not ok', function (done) {
      api.getUser('openid', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getFollowers should not ok', function (done) {
      api.getFollowers(function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getFollowers with nextOpenId should not ok', function (done) {
      api.getFollowers('openid', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendText should not ok', function (done) {
      api.sendText('openid', 'Hellow World', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendImage should not ok', function (done) {
      api.sendImage('openid', 'imageId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendVoice should not ok', function (done) {
      api.sendVoice('openid', 'imageId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendVideo should not ok', function (done) {
      api.sendVideo('openid', 'mediaId', 'thumbMediaId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
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
        err.message.should.be.equal('invalid appid');
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
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    describe('upload media', function () {
      ['Image', 'Voice', 'Video', 'Thumb'].forEach(function (method) {
        before(function () {
          muk(urllib, 'request', function (url, args, callback) {
            var resp = {
              "type":"image",
              "media_id":"usr5xL_gcxapoRjwH3bQZw_zKvcXL-DU4tRJtLtrtN71-3bXL52p3xX63ebp7tqA",
              "created_at":1383233542
            };
            process.nextTick(function () {
              callback(null, resp);
            });
          });
        });

        after(function () {
          muk.restore();
        });
        it('upload' + method + ' should ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/image.jpg'), function (err, data, res) {
            should.not.exist(err);
            data.should.have.property('type', 'image');
            data.should.have.property('media_id');
            data.should.have.property('created_at');
            done();
          });
        });

        it('upload' + method + ' should not ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/inexist.jpg'), function (err, data, res) {
            should.exist(err);
            err.should.have.property('name', 'Error');
            err.should.have.property('code', 'ENOENT');
            done();
          });
        });
      });
    });

    describe('get media with buffer', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var buffer = new Buffer('Hello world!');
          var res =  {
            headers: {
              'content-type': 'image/jpeg'
            }
          };
          process.nextTick(function () {
            callback(null, buffer, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('getMedia with buffer', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.not.exist(err);
          data.toString().should.be.equal('Hello world!');
          done();
        });
      });
    });

    describe('get media with json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = JSON.stringify({"errcode":40007, "errmsg":"invalid media_id"});
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
      it('getMedia with json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'WeChatAPIError');
          err.should.have.property('message', 'invalid media_id');
          done();
        });
      });
    });

    describe('get media with err json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = '{"errcode":40007, "errmsg":"invalid media_id"';
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
      it('getMedia with err json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'SyntaxError');
          done();
        });
      });
    });
  });
});
