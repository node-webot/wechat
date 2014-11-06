var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_semantic', function () {
  var api = new API(config.appid, config.appsecret);
  it('should ok', function (done) {
    var condition = {
      "query":"查一下明天从北京到上海的南航机票",
      "city":"北京",
      "category": "flight,hotel"
    };

    var uid = "123456";

    api.semantic(uid, condition, function (err, data, res) {
      expect(err).to.be.ok();
      expect(data).to.have.property('errcode');
      expect(data).to.have.property('errmsg');
      done();
    });
  });
});
