var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;

var AccessToken = function (accessToken, expireTime) {
  if (!(this instanceof AccessToken)) {
    return new AccessToken(accessToken, expireTime);
  }
  this.accessToken = accessToken;
  this.expireTime = expireTime;
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
  return !!this.accessToken && (new Date().getTime()) < this.expireTime;
};

/**
 * 根据appid和appsecret创建API的构造函数
 * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
 * Wechat模块使用使用token的优先级是：
 *
 * 1. 使用当前缓存的token对象
 * 2. 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
 * 3. 如果上两步不指定，自行使用appid/appsecret获取token（并缓存它）。
 *
 * Access token的更新：
 * 创建API实例之后，如果有发生token的改变，实例对象将触发`token`事件。
 * 在该事件中，开发者可以将得到的token保存到全局存储中。
 * 建议通过`JSON.stringify()`序列化后保存。
 *
 * Examples:
 * ```
 * var API = require('wechat').API;
 * var api = new API('appid', 'secret');
 * ```
 * 以上即可满足单进程使用。
 * 当多进程时，token需要全局维护，以下为保存token的接口。
 * ```
 * api.on('token', function (token) {
 *   // 请将token存储到全局，跨进程级别的全局，比如写到数据库、redis等
 *   // 这样才能在cluster模式下使用，以下为写入到文件的示例
 *   fs.writeFile('access_token.txt', JSON.stringify(token));
 * });
 * // 传入一个获取全局token的方法
 * var api = new API('appid', 'secret', function (callback) {
 *   fs.readFile('access_token.txt', 'utf8', function (err, txt) {
 *     if (err) {return callback(err);}
 *     callback(null, JSON.parse(txt));
 *   });
 * });
 * ```
 * @param {String} appid 在公众平台上申请得到的appid
 * @param {String} appsecret 在公众平台上申请得到的app secret
 * @param {Object} token 可选的。获取全局token对象的方法，多进程模式部署时需在意
 */
var API = function (appid, appsecret, token) {
  this.appid = appid;
  this.appsecret = appsecret;
  if (typeof token === 'function') {
    this.getToken = token;
  }
  this.prefix = 'https://api.weixin.qq.com/cgi-bin/';
  this.mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
  this.fileServerPrefix = 'http://file.api.weixin.qq.com/cgi-bin/';
  this.payPrefix = 'https://api.weixin.qq.com/pay/';
  EventEmitter.call(this);
};
inherits(API, EventEmitter);

/**
 * 根据创建API时传入的appid和appsecret获取access token
 * 进行后续所有API调用时，需要先获取access token
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token>
 *
 * Examples:
 * ```
 * api.getAccessToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
 * ```
 * @param {Function} callback 回调函数
 */
API.prototype.getAccessToken = function (callback) {
  var that = this;
  var url = this.prefix + 'token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
  urllib.request(url, {dataType: 'json'}, wrapper(function (err, data) {
    if (err) {
      return callback(err);
    }
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    that.token = AccessToken(data.access_token, expireTime);
    that.emit('token', that.token);
    callback(err, that.token);
  }));
  return this;
};

/**
 * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用
 * 无需依赖getAccessToken为前置调用
 *
 * @param {Function} method 需要封装的方法
 * @param {Array} args 方法需要的参数
 */
API.prototype.preRequest = function (method, args) {
  var that = this;
  var callback = args[args.length - 1];
  if (that.token && that.token.isValid()) {
    method.apply(that, args);
  } else if (that.getToken) {
    that.getToken(function (err, token) {
      if (err) {
        callback(err);
        return;
      }
      that.token = AccessToken(token.accessToken, token.expireTime);
      method.apply(that, args);
    });
  } else {
    that.getAccessToken(function (err, data) {
      // 如遇错误，通过回调函数传出
      if (err) {
        callback(err, data);
        return;
      }
      method.apply(that, args);
    });
  }
};

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (API.prototype.hasOwnProperty(key)) {
        throw new Error('Don\'t allow override existed prototype method.');
      }
      API.prototype[key] = obj[key];
    }
  }
};

API.AccessToken = AccessToken;

module.exports = API;
