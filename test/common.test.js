var should = require('should');
var urllib = require('urllib');
var API = require('../').API;

describe('common.js', function () {
  describe('getAccessToken', function () {
    var api = new API('appid', 'secret');
    var api2 = new API('appid', 'secret');

    it('should not ok', function (done) {
      api.getAccessToken(function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    describe('mock urllib err', function () {
      var request;
      before(function () {
        request = urllib.request;
        urllib.request = function (url, args, callback) {
          var err = new Error('Urllib Error');
          err.name = 'UrllibError';
          callback(err);
        };
      });

      after(function () {
        urllib.request = request;
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
  });

  describe('invalid token', function () {
    var api = new API('appid', 'secret');
    before(function (done) {
      api.getAccessToken(function (err) {
        done();
      });
    });

    it('createMenu should not ok', function (done) {
      api.createMenu('{}', function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('getMenu should not ok', function (done) {
      api.getMenu(function (err, token) {
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
        console.log(res.statusCode);
        should.exist(err);
        console.log(data);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });
  });
});
