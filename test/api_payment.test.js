var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_payment', function () {
  var api = new API(config.appid, config.appsecret);

  describe('deliverNotify', function () {
    it('should unauthorized', function (done) {
      api.deliverNotify('{}', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('orderQuery', function () {
    it('orderQuery should ok', function (done) {
      api.orderQuery('{}', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
