var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_user', function () {
  var api = new API(config.appid, config.appsecret);
  var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

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
});
