var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_stock', function () {
  var api = new API(config.appid, config.appsecret);

  describe('updateStock', function () {
    it('should unauthorized', function (done) {
      api.updateStock(-1, 'product_id', 'sku', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should unauthorized', function (done) {
      api.updateStock(1, 'product_id', 'sku', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
