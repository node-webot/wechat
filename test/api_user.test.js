var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_user', function () {
  var api = new API(config.appid, config.appsecret);
  var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

  before(function (done) {
    api.getAccessToken(done);
  });

  describe('getUser', function () {
    it('should ok', function (done) {
      api.getUser(puling, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.only.have.keys('subscribe', 'openid', 'nickname',
          'sex', 'language', 'city', 'province', 'country', 'headimgurl',
          'subscribe_time', 'remark');
        done();
      });
    });
  });

  describe('updateRemark', function () {
    it('should ok', function (done) {
      api.updateRemark(puling, 'remarked', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).have.property('errcode', 0);
        expect(data).have.property('errmsg', 'ok');
        done();
      });
    });
  });

  it('getFollowers should ok', function (done) {
    api.getFollowers(function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.only.have.keys('total', 'count', 'data', 'next_openid');
      done();
    });
  });

  it('getFollowers with nextOpenId should ok', function (done) {
    api.getFollowers(puling, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('next_openid');
      done();
    });
  });
});
