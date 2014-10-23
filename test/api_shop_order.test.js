var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_order', function () {
  var api = new API(config.appid, config.appsecret);

  describe('getOrderById', function () {
    it('should unauthorized', function (done) {
      api.getOrderById('order_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getOrdersByStatus', function () {
    it('should unauthorized: (callback)', function (done) {
      api.getOrdersByStatus(function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should unauthorized with status(status, callback)', function (done) {
      api.getOrdersByStatus(2, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should unauthorized with beginTime(beginTime, callback)', function (done) {
      api.getOrdersByStatus(new Date(), function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should exception: (string, callback)', function () {
      expect(function () {
        api.getOrdersByStatus('some string', function () {});
      }).to.throwException(/first parameter must be Number or Date/);
    });

    it('should unauthorized with beginTime&endTime(status, endTime, callback)', function (done) {
      api.getOrdersByStatus(2, new Date(), function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should exception: (string, string, callback)', function () {
      expect(function () {
        api.getOrdersByStatus('some string', 'string', function () {});
      }).to.throwException(/first parameter must be Number and second parameter must be Date/);
    });

    it('should unauthorized with beginTime&endTime(status, beginTime, endTime, callback)', function (done) {
      api.getOrdersByStatus(2, new Date(), new Date(), function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('setExpressForOrder', function () {
    it('should unauthorized', function (done) {
      api.setExpressForOrder('orderId', 'deliveryCompany', 'deliveryTrackNo', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('closeOrder', function () {
    it('should unauthorized', function (done) {
      api.closeOrder('orderId', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

});
