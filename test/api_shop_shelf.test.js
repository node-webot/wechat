var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_shelf', function () {
  var api = new API(config.appid, config.appsecret);
  var shelf = {
    "shelf_data": {
      "module_infos": [
        {
          "group_info": {
            "filter": {
              "count": 2
            },
            "group_id": 50
          },
          "eid": 1
        },
        {
          "group_infos": {
            "groups": [
              {
                "group_id": 49
              },
              {
                "group_id": 50
              },
              {
                "group_id": 51
              }
            ]
          },
          "eid": 2
        },
        {
          "group_info": {
            "group_id": 52,
            "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5Jm64z4I0TTicv0TjN7Vl9bykUUibYKIOjicAwIt6Oy0Y6a1Rjp5Tos8tg/0"
          },
          "eid": 3
        },
        {
          "group_infos": {
            "groups": [
              {
                "group_id": 49,
                "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5uUQx7TLx4tB9qZfbe3JmqR4NkkEmpb5LUWoXF1ek9nga0IkeSSFZ8g/0"
              },
              {
                "group_id": 50,
                "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5G1kdy3ViblHrR54gbCmbiaMnl5HpLGm5JFeENyO9FEZAy6mPypEpLibLA/0"
              },
              {
                "group_id": 52,
                "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5uUQx7TLx4tB9qZfbe3JmqR4NkkEmpb5LUWoXF1ek9nga0IkeSSFZ8g/0"
              }
            ]
          },
          "eid": 4
        },
        {
          "group_infos": {
            "groups": [
              {
               "group_id": 43
             },
             {
               "group_id": 44
             },
             {
               "group_id": 45
             },
             {
               "group_id": 46
             }
           ],
         "img_background": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5uUQx7TLx4tB9qZfbe3JmqR4NkkEmpb5LUWoXF1ek9nga0IkeSSFZ8g/0"
         },
         "eid": 5
       }
       ]
     },
     "shelf_banner": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2ibrWQn8zWFUh1YznsMV0XEiavFfLzDWYyvQOBBszXlMaiabGWzz5B2KhNn2IDemHa3iarmCyribYlZYyw/0",
     "shelf_name": "测试货架"
  };

  describe('createShelf', function () {
    it('should unauthorized with empty list', function (done) {
      api.createShelf(shelf, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('deleteShelf', function () {
    it('should unauthorized', function (done) {
      api.deleteShelf('shelf_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('updateShelf', function () {
    it('should unauthorized', function (done) {
      api.updateShelf(shelf, function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });

  describe('getAllShelves', function () {
    it('should unauthorized', function (done) {
      api.getAllShelves(function (err, data, res) {
        expect(err).to.be.ok();
        expect(err).to.have.property('code', 48001);
        expect(err).to.have.property('message', 'api unauthorized');
        done();
      });
    });
  });

  describe('getShelfById', function () {
    it('should unauthorized', function (done) {
      api.getShelfById('shelf_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
