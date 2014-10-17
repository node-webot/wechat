var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_express', function () {
  var api = new API(config.appid, config.appsecret);
  var express = {
    "delivery_template": {
      "Name": "testexpress",
      "Assumer": 0,
      "Valuation": 0,
      "TopFee": [
        {
          "Type": 10000027,
          "Normal": {
            "StartStandards": 1,
            "StartFees": 2,
            "AddStandards": 3,
            "AddFees": 1
          },
          "Custom": [
            {
              "StartStandards": 1,
              "StartFees": 100,
              "AddStandards": 1,
              "AddFees": 3,
              "DestCountry": "中国",
              "DestProvince": "广东省",
              "DestCity": "广州市"
            }
          ]
        },
        {
          "Type": 10000028,
          "Normal": {
            "StartStandards": 1,
            "StartFees": 3,
            "AddStandards": 3,
            "AddFees": 2
          },
          "Custom": [
            {
              "StartStandards": 1,
              "StartFees": 10,
              "AddStandards": 1,
              "AddFees": 30,
              "DestCountry": "中国",
              "DestProvince": "广东省",
              "DestCity": "广州市"
            }
          ]
        },
        {
          "Type": 10000029,
          "Normal": {
            "StartStandards": 1,
            "StartFees": 4,
            "AddStandards": 3,
            "AddFees": 3
          },
          "Custom": [
            {
              "StartStandards": 1,
              "StartFees": 8,
              "AddStandards": 2,
              "AddFees": 11,
              "DestCountry": "中国",
              "DestProvince": "广东省",
              "DestCity": "广州市"
            }
          ]
        }
      ]
    }
  };

  describe('addExpressTemplate', function () {
    it('should unauthorized with empty list', function (done) {
      api.addExpressTemplate(express, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('deleteExpressTemplate', function () {
    it('should unauthorized', function (done) {
      api.deleteExpressTemplate('tempalte_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('updateExpressTemplate', function () {
    it('should unauthorized', function (done) {
      api.updateExpressTemplate(express, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getExpressTemplateById', function () {
    it('should unauthorized', function (done) {
      api.getExpressTemplateById('template_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getAllExpressTemplates', function () {
    it('should unauthorized', function (done) {
      api.getAllExpressTemplates(function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
