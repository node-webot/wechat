var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;
var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

describe('api_group.js', function () {
  var api = new API(config.appid, config.appsecret);
  before(function (done) {
    api.getAccessToken(done);
  });

  it('getGroups should ok', function (done) {
    api.getGroups(function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('groups');
      expect(data.groups).to.be.an('array');
      done();
    });
  });

  it('getWhichGroup should ok', function (done) {
    api.getWhichGroup(puling, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('groupid');
      done();
    });
  });

  it('createGroup should ok', function (done) {
    api.createGroup('new group', function (err, data, res) {
      // expect(err).not.to.be.ok();
      // expect(data).to.have.property('group');
      // expect(data.group).to.have.property('id');
      // expect(data.group).to.have.property('name');
      expect(err).to.have.property('message', 'too many group now, no need to add new');
      done();
    });
  });

  it('updateGroup should ok', function (done) {
    api.updateGroup(101, 'renamed group', function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errcode', 0);
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });

  it('moveUserToGroup should ok', function (done) {
    api.moveUserToGroup(puling, 102, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errcode', 0);
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });
});
