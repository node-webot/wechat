var path = require('path');
var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_shop_common', function () {
  var api = new API(config.appid, config.appsecret);

  describe('uploadPicture', function () {
    it('should unauthorized', function (done) {
      api.uploadPicture(path.join(__dirname, 'fixture/image.jpg'), function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
