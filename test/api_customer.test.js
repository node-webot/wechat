var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

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
      api.sendText(puling, 'Hellow World', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
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

  describe('sendText', function () {
    it('sendText should ok', function (done) {
      api.sendText(puling, 'Hellow World', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
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
});
