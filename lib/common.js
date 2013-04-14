var urllib = require('urllib');

// http://mp.weixin.qq.com/wiki/index.php?title=%E8%BF%94%E5%9B%9E%E7%A0%81%E8%AF%B4%E6%98%8E
var wrapper = function (callback) {
  return function (err, data) {
    if (err) {
      return callback(err);
    }
    if (data.errcode) {
      return callback(new Error(data.errmsg));
    }
    callback(null, data);
  };
};

var API = function (appid, appsecret) {
  this.appid = appid;
  this.appsecret = appsecret;
  this.prefix = 'https://api.weixin.qq.com/cgi-bin/';
};

/**
 * 根据appid和appsecret获取access token
 * @param {String} appid appid
 * @param {String} appsecret secret
 * @param {Function} callback 回调函数
 */
API.prototype.getAccessToken = function (callback) {
  var that = this;
  var url = this.prefix + 'token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
  urllib.request(url, {dataType: 'json'}, wrapper(function (err, data) {
    if (err) {
      return callback(err);
    }
    that.token = data.access_token;
    setTimeout(function () {
      delete that.token;
    }, data.expires_in * 1000);
    callback(err, data);
  }));
  return this;
};

/**
 * 创建菜单
 * @param {Object} menu     [description]
 * @param {Function} callback [description]
 */
API.prototype.createMenu = function (menu, callback) {
  var url = this.prefix + 'menu/create?access_token=' + this.token;
  var args = {
    dataType: 'json',
    type: 'POST',
    data: menu,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  urllib.request(url, args, wrapper(callback));
};

exports.getMenu = function (menu, callback) {
  var url = this.prefix + 'menu/get?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

exports.removeMenu = function (callback) {
  var url = this.prefix + 'menu/delete?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

exports.initAPI = function (appid, appsecret) {
  return new API(appid, appsecret);
};
