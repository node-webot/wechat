var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var path = require('path');
var API = require('../').API;

describe('api_media.js', function () {
  var api = new API('invalidappid', 'secret');
  var isAccessTokenValid = api.isAccessTokenValid;
  before(function () {
    api.isAccessTokenValid = function () {
      return true;
    };
  });

  after(function () {
    api.isAccessTokenValid = isAccessTokenValid;
  });

  describe('upload media', function () {
    ['Image', 'Voice', 'Video', 'Thumb'].forEach(function (method) {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var resp = {
            "type":"image",
            "media_id":"usr5xL_gcxapoRjwH3bQZw_zKvcXL-DU4tRJtLtrtN71-3bXL52p3xX63ebp7tqA",
            "created_at":1383233542
          };
          process.nextTick(function () {
            callback(null, resp);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('upload' + method + ' should ok', function (done) {
        api['upload' + method](path.join(__dirname, './fixture/image.jpg'), function (err, data, res) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('type', 'image');
          expect(data).to.have.property('media_id');
          expect(data).to.have.property('created_at');
          done();
        });
      });

      it('upload' + method + ' should not ok', function (done) {
        api['upload' + method](path.join(__dirname, './fixture/inexist.jpg'), function (err, data, res) {
          expect(err).to.be.ok();
          expect(err).to.have.property('name', 'Error');
          expect(err).to.have.property('code', 'ENOENT');
          done();
        });
      });
    });
  });

  describe('get media with buffer', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var buffer = new Buffer('Hello world!');
        var res =  {
          headers: {
            'content-type': 'image/jpeg'
          }
        };
        process.nextTick(function () {
          callback(null, buffer, res);
        });
      });
    });

    after(function () {
      muk.restore();
    });

    it('getMedia with buffer', function (done) {
      api.getMedia('media_id', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data.toString()).to.be('Hello world!');
        done();
      });
    });
  });

  describe('get media with json', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = JSON.stringify({"errcode":40007, "errmsg":"invalid media_id"});
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
    it('getMedia with json', function (done) {
      api.getMedia('media_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('message', 'invalid media_id');
        done();
      });
    });
  });

  describe('get media with err json', function () {
    before(function () {
      muk(urllib, 'request', function (url, args, callback) {
        var data = '{"errcode":40007, "errmsg":"invalid media_id"';
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
    it('getMedia with err json', function (done) {
      api.getMedia('media_id', function (err, data, res) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'SyntaxError');
        done();
      });
    });
  });
});
