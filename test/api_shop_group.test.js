var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_group', function () {
  var api = new API(config.appid, config.appsecret);

  describe('createGoodsGroup', function () {
    it('should unauthorized with empty list', function (done) {
      api.createGoodsGroup('group_name', [], function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should unauthorized', function (done) {
      api.createGoodsGroup('group_name', ['product_id'], function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getGroupById', function () {
    it('should unauthorized', function (done) {
      api.getGroupById('id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getAllGroups', function () {
    it('should unauthorized', function (done) {
      api.getAllGroups(function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('deleteGoodsGroup', function () {
    it('should unauthorized', function (done) {
      api.deleteGoodsGroup('group_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('updateGoodsForGroup', function () {
    it('should unauthorized', function (done) {
      api.updateGoodsForGroup('group_id', ['add_id'], ['remove_id'], function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });

    it('should unauthorized with empty list', function (done) {
      api.updateGoodsForGroup('group_id', [], [], function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('updateGoodsGroup', function () {
    it('should unauthorized', function (done) {
      api.updateGoodsGroup('group_id', 'new name', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
