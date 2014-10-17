var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_goods', function () {
  var api = new API(config.appid, config.appsecret);
  var goods = {
    "product_base":{
      "category_id":[
        "537074298"
      ],
      "property":[
        {"id":"1075741879","vid":"1079749967"},
        {"id":"1075754127","vid":"1079795198"},
        {"id":"1075777334","vid":"1079837440"}
      ],
      "name":"testaddproduct",
      "sku_info":[
        {
          "id":"1075741873",
          "vid":["1079742386","1079742363"]
        }
      ],
      "main_img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0",
      "img":[
        "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0"
      ],
      "detail":[
        {"text":"testfirst"},
        {"img": "4whpV1VZl2iccsvYbHvnphkyGtnvjD3ul1UcLcwxrFdwTKYhH9Q5YZoCfX4Ncx655ZK6ibnlibCCErbKQtReySaVA/0"},
        {"text":"testagain"}
      ],
      "buy_limit":10
    },
    "sku_list":[
      {
        "sku_id":"1075741873:1079742386",
        "price":30,
        "icon_url": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl28bJj62XgfHPibY3ORKicN1oJ4CcoIr4BMbfA8LqyyjzOZzqrOGz3f5K Wq1QGP3fo6TOTSYD3TBQjuw/0",
        "product_code":"testing",
        "ori_price":9000000,
        "quantity":800
      },
      {
        "sku_id":"1075741873:1079742363",
        "price":30,
        "icon_url": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl28bJj62XgfHPibY3ORKicN1oJ4CcoIr4BMbfA8LqyyjzOZzqrOGz3f5K Wq1QGP3fo6TOTSYD3TBQjuw/0",
        "product_code":"testingtesting",
        "ori_price":9000000,
        "quantity":800
      }
    ],
    "attrext":{
      "location":{
        "country":"中国",
        "province":"广东省",
        "city":"广州市",
        "address":"T.I.T创意园"
      },
      "isPostFree":0,
      "isHasReceipt":1,
      "isUnderGuaranty":0,
      "isSupportReplace":0
    },
    "delivery_info":{
      "delivery_type":0,
      "template_id":0,
      "express":[
        {"id":10000027,"price":100},
        {"id":10000028,"price":100},
        {"id":10000029,"price":100}
      ]
    }
  };

  describe('createGoods', function () {
    it('should unauthorized with empty list', function (done) {
      api.createGoods(goods, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('deleteGoods', function () {
    it('should unauthorized', function (done) {
      api.deleteGoods('product_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('updateGoods', function () {
    it('should unauthorized', function (done) {
      api.updateGoods(goods, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getGoods', function () {
    it('should unauthorized', function (done) {
      api.getGoods('product_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getGoodsByStatus', function () {
    it('should unauthorized', function (done) {
      api.getGoodsByStatus(0, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('updateGoodsStatus', function () {
    it('should unauthorized', function (done) {
      api.updateGoodsStatus('product_id', 1, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getSubCats', function () {
    it('should unauthorized', function (done) {
      api.getSubCats('cat_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getSKUs', function () {
    it('should unauthorized', function (done) {
      api.getSKUs('cat_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getProperties', function () {
    it('should unauthorized', function (done) {
      api.getProperties('cat_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
