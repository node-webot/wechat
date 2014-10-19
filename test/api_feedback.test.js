var config = require('./config');
var API = require('../').API;
var expect = require('expect.js');

describe('api_feedback', function () {
  var api = new API(config.appid, config.appsecret);

  describe('updateFeedback', function () {
    it('should unauthorized with empty list', function (done) {
      api.updateFeedback('openid', 'feedback_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(data).to.have.property('errcode', 48001);
        expect(data).to.have.property('errmsg', 'api unauthorized');
        done();
      });
    });
  });
});
