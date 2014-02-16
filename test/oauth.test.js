var should = require('should');
var urllib = require('urllib');
var muk = require('muk');
var OAuth = require('../').OAuth;

describe('oauth.js', function () {
  describe('getAuthorizeURL', function () {
    var auth = new OAuth('appid', 'secret');

    it('should ok', function () {
      var url = auth.getAuthorizeURL('http://diveintonode.org/', 'hehe');
      url.should.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Fdiveintonode.org%2F&response_type=code&scope=snsapi_base&state=hehe#wechat_redirect');
    });

    it('should ok', function () {
      var url = auth.getAuthorizeURL('http://diveintonode.org/', 'hehe', 'snsapi_userinfo');
      url.should.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Fdiveintonode.org%2F&response_type=code&scope=snsapi_userinfo&state=hehe#wechat_redirect');
    });
  });

  describe('getAccessToken', function () {
    var api = new OAuth('appid', 'secret');
    it('should invalid', function (done) {
      api.getAccessToken('code', function (err, data) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('system error');
        done();
      });
    });

    describe('should ok', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var resp = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
          };
          process.nextTick(function () {
            callback(null, resp);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.getAccessToken('code', function (err, data, res) {
          should.not.exist(err);
          data.should.have.keys('access_token', 'expires_in', 'refresh_token', 'openid', 'scope');
          done();
        });
      });
    });
  });

  describe('refreshAccessToken', function () {
    var api = new OAuth('appid', 'secret');
    api.refreshToken = 'token';

    it('should invalid', function (done) {
      api.refreshAccessToken(function (err, data) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    describe('should ok', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var resp = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
          };
          process.nextTick(function () {
            callback(null, resp);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.refreshAccessToken(function (err, data, res) {
          should.not.exist(err);
          data.should.have.keys('access_token', 'expires_in', 'refresh_token', 'openid', 'scope');
          done();
        });
      });
    });
  });

  describe('getUser', function () {
    var api = new OAuth('appid', 'secret');
    api.accessToken = 'ACCESS_TOKEN';

    it('should invalid', function (done) {
      api._getUser('openid', function (err, data) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid credential');
        done();
      });
    });

    it('should invalid with refresh_token missing', function (done) {
      api.getUser('openid', function (err, data) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('refresh_token missing');
        done();
      });
    });

    describe('should ok', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var resp = {
            "openid": "OPENID",
            "nickname": "NICKNAME",
            "sex": "1",
            "province": "PROVINCE",
            "city": "CITY",
            "country": "COUNTRY",
            "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46", 
            "privilege": [
              "PRIVILEGE1",
              "PRIVILEGE2"
            ]
          };
          process.nextTick(function () {
            callback(null, resp);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        api.getUser('openid', function (err, data, res) {
          should.not.exist(err);
          data.should.have.keys('openid', 'nickname', 'sex', 'province', 'city', 'country', 'headimgurl', 'privilege');
          done();
        });
      });
    });

    describe('should ok', function () {
      before(function () {
        muk(api, 'isAccessTokenValid', function () {
          return true;
        });
      });

      after(function () {
        muk.restore();
      });

      it('should not ok', function (done) {
        api.accessToken = 'ACCESS_TOKEN';
        api.getUser('openid', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'WeChatAPIError');
          err.should.have.property('message', 'invalid credential');
          done();
        });
      });
    });
  });
});
