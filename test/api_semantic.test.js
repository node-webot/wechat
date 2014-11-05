var config = require('./config');
var API = require('../').API;
var muk = require('muk');
var urllib = require('urllib');
var expect = require('expect.js');

describe('api_semantic', function () {
  var api = new API(config.appid, config.appsecret);
  describe('mock semantic', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = {"semantic": {}};
        var res =  {
          headers: {
            'content-type': 'application/json'
          }
        };
        process.nextTick(function () {
          callback(null, data, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });

    it('getSemanticResult should ok', function (done) {
      var condition = {
        "query":"查一下明天从北京到上海的南航机票",
        "city":"北京",
        "category": "flight,hotel",
        "appid":"wxaaaaaaaaaaaaaaaa",
        "uid":"123456"
      };

      api.getRecords(condition, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('semantic');
        done();
      });
    });
  });
});
