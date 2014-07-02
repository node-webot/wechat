var should = require('should');
var API = require('../').API;

describe('pay', function () {
  var api = new API('appid', 'secret');
  it('deliverNotify should ok', function (done) {
    api.deliverNotify('{}', function (err, menu) {
      should.exist(err);
      err.name.should.be.equal('WeChatAPIError');
      err.message.should.be.equal('invalid appid');
      done();
    });
  });

  it('orderQuery should ok', function (done) {
    api.orderQuery('{}', function (err, menu) {
      should.exist(err);
      err.name.should.be.equal('WeChatAPIError');
      err.message.should.be.equal('invalid appid');
      done();
    });
  });
});
