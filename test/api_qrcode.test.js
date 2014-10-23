var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('valid appid', function () {
  var api = new API(config.appid, config.appsecret);
  before(function (done) {
    api.getAccessToken(done);
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
});
