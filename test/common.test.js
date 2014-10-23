var should = require('should');
var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var path = require('path');
var config = require('./config');
var API = require('../').API;

var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';
var imageId = 'XDZxzuRWBPqI4R9n_nNR5uRVZVQCSneMoELyWKflwM2qF9K38vnVFzgaD97uCTUu';
var thumbId = 'BHxGDVy7WY6BCOcv3AwbywUE630Vw0tAV_V8bzBaCZid4Km5fwXrVOso3X0zas4n';
var movieId = 'b4F8SfaZZQwalDxwPjd923ACV5IUeYvZ9-dYKf5ytXrS-IImXEkl2U8Fl5EH-jCF';

xdescribe('common.js', function () {
  describe('isAccessTokenValid', function () {
    it('should invalid', function () {
      var token = new API.AccessToken('token', new Date().getTime() - 7200 * 1000);
      token.isValid().should.be.equal(false);
    });

    it('should valid', function () {
      var token = new API.AccessToken('token', new Date().getTime() + 7200 * 1000);
      token.isValid().should.be.equal(true);
    });
  });

  describe('valid appid', function () {
    var api = new API(config.appid, config.appsecret);
    before(function (done) {
      api.getAccessToken(done);
    });

    it('createMenu should ok', function (done) {
      var menu = JSON.stringify(require('./fixture/menu.json'));
      api.createMenu(menu, function (err, result) {
        expect(err).not.to.be.ok();
        expect(result).to.have.property('errcode', 0);
        expect(result).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('getMenu should ok', function (done) {
      api.getMenu(function (err, menu) {
        expect(err).not.to.be.ok();
        expect(menu).to.have.property('menu');
        expect(menu.menu).to.have.property('button');
        expect(menu.menu.button).to.have.length(3);
        done();
      });
    });

    it('removeMenu should ok', function (done) {
      api.removeMenu(function (err, result) {
        expect(err).not.to.be.ok();
        expect(result).to.have.property('errcode', 0);
        expect(result).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('createTmpQRCode should ok', function (done) {
      api.createTmpQRCode(123, 1800, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('ticket');
        expect(data).to.have.property('expire_seconds');
        done();
      });
    });

    it('createLimitQRCode should ok', function (done) {
      api.createLimitQRCode(123, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('ticket');
        done();
      });
    });

    it('showQRCodeURL should ok', function () {
      api.showQRCodeURL('ticket').should.be.equal('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=ticket');
    });

    describe('sendImage', function () {
      before(function () {
        muk(api, 'sendImage', function (openid, mediaId, callback) {
          process.nextTick(function () {
            callback(null, {errcode: 0, errmsg: 'ok'});
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.sendImage(puling, imageId, function (err, data, res) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
          done();
        });
      });
    });

    describe('sendVideo', function () {
      before(function () {
        muk(api, 'sendVideo', function (openid, movieId, thumbId, callback) {
          process.nextTick(function () {
            callback(null, {errcode: 0, errmsg: 'ok'});
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.sendVideo(puling, movieId, thumbId, function (err, data, res) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
          done();
        });
      });
    });

    describe('sendMusic', function () {
      before(function () {
        muk(api, 'sendMusic', function (openid, music, callback) {
          process.nextTick(function () {
            callback(null, {errcode: 0, errmsg: 'ok'});
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        var music = {
          "title":"MUSIC_TITLE", // 可选
          "description":"MUSIC_DESCRIPTION", // 可选
          "musicurl":"MUSIC_URL",
          "hqmusicurl":"HQ_MUSIC_URL",
          "thumb_media_id": thumbId
        };

        api.sendMusic(puling, music, function (err, data, res) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('errcode', 0);
          expect(data).to.have.property('errmsg', 'ok');
          done();
        });
      });
    });

    describe('upload media', function () {
      var fixture = {
        'Image': path.join(__dirname, './fixture/image.jpg'),
        'Voice': path.join(__dirname, './fixture/test.mp3'),
        'Video': path.join(__dirname, './fixture/movie.mp4'),
        'Thumb': path.join(__dirname, './fixture/pic.jpg')
      };

      before(function () {
        muk(api, 'uploadVideo', function (filepath, callback) {
          if (filepath === path.join(__dirname, './fixture/inexist.jpg')) {
            return process.nextTick(function () {
              var err = new Error();
              err.code = 'ENOENT';
              callback(err);
            });
          }
          var data = {
            created_at: '',
            media_id: '',
            type: 'video'
          };
          var res =  {
            headers: {
              'content-type': 'image/jpeg'
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

      ['Image', 'Voice', 'Video', 'Thumb'].forEach(function (method) {
        it('upload' + method + ' should ok', function (done) {
          // 上传文件比较慢
          this.timeout(60000);
          api['upload' + method](fixture[method], function (err, data, res) {
            should.not.exist(err);
            data.should.have.property('type', method.toLowerCase());
            if (method === 'Thumb') {
              data.should.have.property('thumb_media_id');
            } else {
              data.should.have.property('media_id');
            }
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
