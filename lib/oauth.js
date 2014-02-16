var urllib = require('urllib');
var wrapper = require('./util').wrapper;
var querystring = require('querystring');

/*!
 * 处理token，更新过期时间
 */
var processToken = function (that, callback) {
  return function (err, data, res) {
    if (err) {
      return callback(err, data);
    }
    that.accessToken = data.access_token;
    that.refreshToken = data.refresh_token;
    that.expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    callback(err, data);
  };
};

/**
 * 根据appid和appsecret创建OAuth接口的构造函数
 *
 * Examples:
 * ```
 * var OAuth = require('wechat').OAuth;
 * var api = new OAuth('appid', 'secret');
 * ```
 * @param {String} appid 在公众平台上申请得到的appid
 * @param {String} appsecret 在公众平台上申请得到的app secret
 */
var OAuth = function (appid, appsecret) {
  this.appid = appid;
  this.appsecret = appsecret;
};

/**
 * 获取授权页面的URL地址
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
 */
OAuth.prototype.getAuthorizeURL = function (redirect, state, scope) {
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  var info = {
    appid: this.appid,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };

  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
};

/**
 * 返回当前的access token是否有效
 */
OAuth.prototype.isAccessTokenValid = function () {
  return this.expireTime && (new Date().getTime()) < this.expireTime;
};

/**
 * 根据授权获取到的code，换取access token
 * 获取openid之后，可以调用`wechat.API`来获取更多信息
 * Examples:
 * ```
 * api.getAccessToken(code, callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  "access_token": "ACCESS_TOKEN",
 *  "expires_in": 7200,
 *  "refresh_token": "REFRESH_TOKEN",
 *  "openid": "OPENID",
 *  "scope": "SCOPE"
 * }
 * ```
 * @param {String} code 授权获取到的code
 * @param {Function} callback 回调函数
 */
OAuth.prototype.getAccessToken = function (code, callback) {
  var url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
  var info = {
    appid: this.appid,
    secret: this.appsecret,
    code: code,
    grant_type: 'authorization_code'
  };
  var args = {
    data: info,
    dataType: 'json'
  };
  urllib.request(url, args, wrapper(processToken(this, callback)));
};

/**
 * 根据refresh token，刷新access token，调用getAccessToken后才有效
 * Examples:
 * ```
 * api.refreshAccessToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 刷新access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  "access_token": "ACCESS_TOKEN",
 *  "expires_in": 7200,
 *  "refresh_token": "REFRESH_TOKEN",
 *  "openid": "OPENID",
 *  "scope": "SCOPE"
 * }
 * ```
 * @param {Function} callback 回调函数
 */
OAuth.prototype.refreshAccessToken = function (callback) {
  var that = this;
  var url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
  var info = {
    appid: this.appid,
    grant_type: 'refresh_token',
    refresh_token: that.refreshToken
  };
  var args = {
    data: info,
    dataType: 'json'
  };
  urllib.request(url, args, wrapper(processToken(this, callback)));
};

OAuth.prototype._getUser = function (openid, callback) {
  var url = 'https://api.weixin.qq.com/sns/userinfo';
  var info = {
    access_token: this.accessToken,
    openid: openid
  };
  var args = {
    data: info,
    dataType: 'json'
  };
  urllib.request(url, args, wrapper(callback));
};

/**
 * 根据openid，获取用户信息。
 * 当access token无效时，自动通过refresh token获取新的access token。然后再获取用户信息
 * Examples:
 * ```
 * api.refreshAccessToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取用户信息出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  "openid": "OPENID",
 *  "nickname": "NICKNAME",
 *  "sex": "1",
 *  "province": "PROVINCE"
 *  "city": "CITY",
 *  "country": "COUNTRY",
 *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46", 
 *  "privilege": [
 *    "PRIVILEGE1"
 *    "PRIVILEGE2"
 *  ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
OAuth.prototype.getUser = function (openid, callback) {
  var that = this;
  if (this.isAccessTokenValid()) {
    that._getUser(openid, callback);
  } else {
    that.refreshAccessToken(function (err, data) {
      if (err) {
        return callback(err);
      }
      that._getUser(openid, callback);
    });
  }
};

module.exports = OAuth;
