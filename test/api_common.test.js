var API = require('../').API;
var urllib = require('urllib');
var muk = require('muk');
var expect = require('expect.js');
var config = require('./config');

describe('api_common', function () {
  describe('isAccessTokenValid', function () {
    it('should invalid', function () {
      var token = new API.AccessToken('token', new Date().getTime() - 7200 * 1000);
      expect(token.isValid()).not.to.be.ok();
    });

    it('should valid', function () {
      var token = new API.AccessToken('token', new Date().getTime() + 7200 * 1000);
      expect(token.isValid()).to.be.ok();
    });
  });

  describe('mixin', function () {
    it('should ok', function () {
      API.mixin({sayHi: function () {}});
      expect(API.prototype).to.have.property('sayHi');
    });

    it('should not ok when override method', function () {
      var obj = {sayHi: function () {}};
      expect(API.mixin).withArgs(obj).to.throwException(/Don't allow override existed prototype method\./);
    });
  });

  describe('getAccessToken', function () {
    it('should ok', function (done) {
      var api = new API(config.appid, config.appsecret);
      api.getAccessToken(function (err, token) {
        expect(err).not.to.be.ok();
        expect(token).to.only.have.keys('accessToken', 'expireTime');
        done();
      });
    });

    it('should not ok', function (done) {
      var api = new API('appid', 'secret');
      api.getAccessToken(function (err, token) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('message', 'invalid credential');
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
        var api = new API('appid', 'secret');
        api.getAccessToken(function (err, token) {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'WeChatAPIUrllibError');
          expect(err).to.have.property('message', 'Urllib Error');
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
        var api = new API('appid', 'secret');
        api.getAccessToken(function (err, token) {
          expect(err).not.to.be.ok();
          expect(token).to.have.property('accessToken', 'ACCESS_TOKEN');
          // token.should.have.property('expireTime', 7200);
          done();
        });
      });
    });

    describe('mock saveToken err', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'saveToken', function (token, callback) {
          process.nextTick(function () {
            callback(new Error('mock saveToken err'));
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.getAccessToken(function (err, token) {
          expect(err).to.be.ok();
          expect(err).to.have.property('message', 'mock saveToken err');
          done();
        });
      });
    });
  });

  describe('preRequest', function () {
    it('should ok', function (done) {
      var api = new API(config.appid, config.appsecret);
      api.preRequest(function (callback) {
        callback();
      }, [function (err) {
        expect(err).not.to.be.ok();
        done();
      }]);
    });

    describe('mock getToken err', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'getToken', function (callback) {
          process.nextTick(function () {
            callback(new Error('mock getToken error'));
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        api.preRequest(function (callback) {
          callback();
        }, [function (err) {
          expect(err).to.be.ok();
          expect(err).have.property('message', 'mock getToken error');
          done();
        }]);
      });
    });

    describe('mock getAccessToken err', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'getAccessToken', function (callback) {
          process.nextTick(function () {
            callback(new Error('mock getAccessToken error'));
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        api.preRequest(function (callback) {
          callback();
        }, [function (err) {
          expect(err).to.be.ok();
          expect(err).have.property('message', 'mock getAccessToken error');
          done();
        }]);
      });
    });

    describe('mock getToken ok', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'getToken', function (callback) {
          process.nextTick(function () {
            callback(null, {accessToken: 'token', expireTime: (new Date().getTime() + 10000)});
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        api.preRequest(function (callback) {
          callback();
        }, [function (err) {
          expect(err).not.to.be.ok();
          done();
        }]);
      });
    });

    describe('mock getToken ok with retry', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'getToken', function (callback) {
          process.nextTick(function () {
            callback(null, {accessToken: 'token', expireTime: (new Date().getTime() + 10000)});
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        var i = 0;
        api.preRequest(function (callback) {
          i++;
          if (i === 1) {
            callback(null, {errcode: 40001});
          } else {
            callback(null, {errcode: 0});
          }
        }, [function (err) {
          expect(err).not.to.be.ok();
          done();
        }]);
      });
    });
  });

  describe('getLatestToken', function () {
    it('should ok', function (done) {
      var api = new API(config.appid, config.appsecret);
      api.getLatestToken(function (err, token) {
        expect(err).not.to.be.ok();
        expect(token).to.only.have.keys('accessToken', 'expireTime');
        done();
      });
    });

    describe('mock getToken err', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'getToken', function (callback) {
          process.nextTick(function () {
            callback(new Error('mock getToken error'));
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        api.getLatestToken(function (err) {
          expect(err).to.be.ok();
          expect(err).have.property('message', 'mock getToken error');
          done();
        });
      });
    });

    describe('mock getToken ok', function () {
      var api = new API(config.appid, config.appsecret);
      before(function () {
        muk(api, 'getToken', function (callback) {
          process.nextTick(function () {
            callback(null, {accessToken: 'token', expireTime: (new Date().getTime() + 10000)});
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        api.getLatestToken(function (err, token) {
          expect(err).not.to.be.ok();
          expect(token).have.property('accessToken');
          expect(token).have.property('expireTime');
          done();
        });
      });
    });
  });
});
