var API = require('../').API;
var urllib = require('urllib');
var muk = require('muk');
var expect = require('expect.js');
var config = require('./config');

describe('common.js', function () {
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
  });

  describe('preRequest', function () {
    it('should ok', function (done) {
      var api = new API(config.appid, config.appsecret);
      api.preRequest(function (callback) {
        callback();
      }, [function () {
        done();
      }]);
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
  });
});
