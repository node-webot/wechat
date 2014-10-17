var urllib = require('urllib');
var wrapper = require('./util').wrapper;
var querystring = require('querystring');

var AccessToken = function (data) {
  if (!(this instanceof AccessToken)) {
    return new AccessToken(data);
  }
  this.data = data;
};

/**
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
AccessToken.prototype.isValid = function () {
  return !!this.data.access_token && (new Date().getTime()) < (this.data.create_at + this.data.expires_in * 1000);
};

/*!
 * 处理token，更新过期时间
 */
var processToken = function (that, callback) {
  return function (err, data, res) {
    if (err) {
      return callback(err, data);
    }
    data.create_at = new Date().getTime();
    // 存储token
    that.saveToken(data.openid, data, function (err) {
      callback(err, AccessToken(data));
    });
  };
};

/**
 * 根据appid和appsecret创建OAuth接口的构造函数
 * 如需跨进程跨机器进行操作，access token需要进行全局维护
 * 使用使用token的优先级是：
 *
 * 1. 使用当前缓存的token对象
 * 2. 调用开发传入的获取token的异步方法，获得token之后使用（并缓存它）。

 * Examples:
 * ```
 * var OAuth = require('wechat').OAuth;
 * var api = new OAuth('appid', 'secret');
 * ```
 * @param {String} appid 在公众平台上申请得到的appid
 * @param {String} appsecret 在公众平台上申请得到的app secret
 * @param {Function} getToken 用于获取token的方法
 * @param {Function} saveToken 用于保存token的方法
 */
var OAuth = function (appid, appsecret, getToken, saveToken) {
  this.appid = appid;
  this.appsecret = appsecret;
  // token的获取和存储
  this.store = {};
  this.getToken = getToken || function (openid, callback) {
    callback(null, this.store[openid]);
  };
  this.saveToken = saveToken || function (openid, token, callback) {
    // 不建议在生产环境中使用它
    if (process.env.NODE_ENV === 'production') {
      console.warn('Please don\'t save token into memory under production');
    }
    this.store[openid] = token;
    callback(null);
  };
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
 *  data: {
 *    "access_token": "ACCESS_TOKEN",
 *    "expires_in": 7200,
 *    "refresh_token": "REFRESH_TOKEN",
 *    "openid": "OPENID",
 *    "scope": "SCOPE"
 *  }
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
 * api.refreshAccessToken(refreshToken, callback);
 * ```
 * Callback:
 *
 * - `err`, 刷新access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  data: {
 *    "access_token": "ACCESS_TOKEN",
 *    "expires_in": 7200,
 *    "refresh_token": "REFRESH_TOKEN",
 *    "openid": "OPENID",
 *    "scope": "SCOPE"
 *  }
 * }
 * ```
 * @param {Function} callback 回调函数
 */
OAuth.prototype.refreshAccessToken = function (refreshToken, callback) {
  var url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
  var info = {
    appid: this.appid,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };
  var args = {
    data: info,
    dataType: 'json'
  };
  urllib.request(url, args, wrapper(processToken(this, callback)));
};

OAuth.prototype._getUser = function (options, accessToken, callback) {
  var url = 'https://api.weixin.qq.com/sns/userinfo';
  var info = {
    access_token: accessToken,
    openid: options.openid,
    lang: options.lang ? options.lang : 'en'
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
 * api.getUser(options, callback);
 *
 * options:
 * ```
 * openId
 * 或
 * {
 *  "openId": "the open Id", // 必须
 *  "lang": 'the lang code" // zh_CN 简体，zh_TW 繁体，en 英语'
 * }
 *
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
OAuth.prototype.getUser = function (options, callback) {
  if (typeof options !== 'object') {
    options = {
      openid: options 
    }
  }
  var that = this;
  this.getToken(options.openid, function (err, data) {
    if (err) {
      return callback(err);
    }
    // 没有token数据
    if (!data) {
      var error = new Error('No token for ' + options.openid + ', please authorize first.');
      error.name = 'NoOAuthTokenError';
      return callback(error);
    }
    var token = AccessToken(data);
    if (token.isValid()) {
      that._getUser(options, token.data.access_token, callback);
    } else {
      that.refreshAccessToken(token.data.refresh_token, function (err, token) {
        if (err) {
          return callback(err);
        }
        that._getUser(options, token.access_token, callback);
      });
    }
  });
};

module.exports = OAuth;
