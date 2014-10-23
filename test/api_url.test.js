var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('api_url.js', function () {
  var api = new API(config.appid, config.appsecret);
  before(function (done) {
    api.getLatestToken(done);
  });

  it('shorturl should ok', function (done) {
    api.shorturl('https://github.com/', function (err, result) {
      expect(err).to.be.ok();
      expect(err).to.have.property('message', 'api unauthorized');
      done();
    });
  });
});
