var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('api_menu.js', function () {
  var api = new API(config.appid, config.appsecret);
  before(function (done) {
    api.getAccessToken(done);
  });

  it('createMenu should ok', function (done) {
    var menu = JSON.stringify(require('./fixture/menu.json'));
    api.createMenu(menu, function (err, result) {
      expect(err).not.to.be.ok();
      expect(result).to.have.property('errcode', 0);
      expect(result).to.have.property('errmsg', 'ok');
      done();
    });
  });

  it('getMenu should ok', function (done) {
    api.getMenu(function (err, menu) {
      expect(err).not.to.be.ok();
      expect(menu).to.have.property('menu');
      expect(menu.menu).to.have.property('button');
      expect(menu.menu.button).to.have.length(3);
      done();
    });
  });

  it('removeMenu should ok', function (done) {
    api.removeMenu(function (err, result) {
      expect(err).not.to.be.ok();
      expect(result).to.have.property('errcode', 0);
      expect(result).to.have.property('errmsg', 'ok');
      done();
    });
  });
});
