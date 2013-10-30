var urllib = require('urllib');

// http://mp.weixin.qq.com/wiki/index.php?title=%E8%BF%94%E5%9B%9E%E7%A0%81%E8%AF%B4%E6%98%8E
var wrapper = function (callback) {
  return function (err, data, res) {
    if (err) {
      err.name = 'WeChatAPI' + err.name;
      return callback(err, data, res);
    }
    if (data.errcode) {
      err = new Error(data.errmsg);
      err.name = 'WeChatAPIError';
      return callback(err, data, res);
    }
    callback(null, data, res);
  };
};

var postJSON = function (data) {
  return {
    dataType: 'json',
    type: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
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
    callback(err, data);
  }));
  return this;
};

/**
 * 创建菜单
 * @param {Object} menu 菜单对象
 * @param {Function} callback 回调函数
 */
API.prototype.createMenu = function (menu, callback) {
  var url = this.prefix + 'menu/create?access_token=' + this.token;
  urllib.request(url, postJSON(menu), wrapper(callback));
};

/**
 * 获取菜单
 * @param {Function} callback 回调函数
 */
API.prototype.getMenu = function (callback) {
  var url = this.prefix + 'menu/get?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 删除菜单
 * @param {Function} callback 回调函数
 */
API.prototype.removeMenu = function (callback) {
  var url = this.prefix + 'menu/delete?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取二维码
 * @param {Object} data 二维码数据
 * @param {Function} callback 回调函数
 */
API.prototype.getQRCode = function (data, callback) {
  var url = this.prefix + 'qrcode/get?access_token=' + this.token;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建临时二维码
 * @param {String} sceneId 场景ID
 * @param {Number} expire 过期时间，单位秒。最大不超过1800
 * @param {Function} callback 回调函数
 */
API.prototype.createTmpQRCode = function (sceneId, expire, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token;
  var data = {
    "expire_seconds": expire,
    "action_name": "QR_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建永久二维码
 * @param {String} sceneId 场景ID。ID不能大于1000
 * @param {Function} callback 回调函数
 */
API.prototype.createLimitQRCode = function (sceneId, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token;
  var data = {
    "action_name": "QR_LIMIT_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 生成显示二维码的链接
 * @param {String} ticket 二维码Ticket
 */
API.prototype.showQRCodeURL = function (ticket) {
  return this.prefix + 'showqrcode?ticket=' + ticket;
};

// ## 分组API http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3
/**
 * 获取分组列表
 */
API.prototype.getGroups = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/get?access_token=ACCESS_TOKEN
  var url = this.prefix + 'groups/get?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 创建分组
 * @param {String} name 分组名字
 */
API.prototype.createGroup = function (name, callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/create?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"name":"test"}}
  var url = this.prefix + 'groups/create?access_token=' + this.token;
  var data = {
    "group": {"name": name}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 更新分组名字
 * @param {Number} id 分组ID
 * @param {String} name 新的分组名字
 */
API.prototype.updateGroup = function (id, name, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"id":108,"name":"test2_modify2"}}
  var url = this.prefix + 'groups/update?access_token=' + this.token;
  var data = {
    "group": {"id": id, "name": name}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 移动用户进分组
 * @param {String} openid 用户的openid
 * @param {Number} groupId 分组ID
 */
API.prototype.moveUserToGroup = function (openid, groupId, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"openid":"oDF3iYx0ro3_7jD4HFRDfrjdCM58","to_groupid":108}
  var url = this.prefix + 'groups/update?access_token=' + this.token;
  var data = {
    "openid": openid,
    "to_groupid": groupId
  };
  var args = {
    dataType: 'json',
    type: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  urllib.request(url, args, wrapper(callback));
};

module.exports = API;
