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
  });

  describe('mock', function () {
    
  });
});
