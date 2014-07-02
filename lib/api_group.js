var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 获取分组列表
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.getGroups(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "groups": [
 *    {"id": 0, "name": "未分组", "count": 72596},
 *    {"id": 1, "name": "黑名单", "count": 36}
 *  ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getGroups = function (callback) {
  this.preRequest(this._getGroups, arguments);
};

/*!
 * 获取分组列表的未封装版本
 */
exports._getGroups = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/get?access_token=ACCESS_TOKEN
  var url = this.prefix + 'groups/get?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 查询用户在哪个分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.getWhichGroup(openid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "groupid": 102
 * }
 * ```
 * @param {String} openid Open ID
 * @param {Function} callback 回调函数
 */
exports.getWhichGroup = function (openid, callback) {
  this.preRequest(this._getWhichGroup, arguments);
};

/*!
 * 查询用户在哪个分组未分组版本
 */
exports._getWhichGroup = function (openid, callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/getid?access_token=ACCESS_TOKEN
  var url = this.prefix + 'groups/getid?access_token=' + this.token.accessToken;
  var data = {
    "openid": openid
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.createGroup('groupname', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"group": {"id": 107, "name": "test"}}
 * ```
 * @param {String} name 分组名字
 * @param {Function} callback 回调函数
 */
exports.createGroup = function (name, callback) {
  this.preRequest(this._createGroup, arguments);
};

/*!
 * 创建分组的未封装版本
 */
exports._createGroup = function (name, callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/create?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"name":"test"}}
  var url = this.prefix + 'groups/create?access_token=' + this.token.accessToken;
  var data = {
    "group": {"name": name}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 更新分组名字
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.updateGroup(107, 'new groupname', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {Number} id 分组ID
 * @param {String} name 新的分组名字
 * @param {Function} callback 回调函数
 */
exports.updateGroup = function (id, name, callback) {
  this.preRequest(this._updateGroup, arguments);
};

/*!
 * 更新分组名字的未封装版本
 */
exports._updateGroup = function (id, name, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"id":108,"name":"test2_modify2"}}
  var url = this.prefix + 'groups/update?access_token=' + this.token.accessToken;
  var data = {
    "group": {"id": id, "name": name}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 移动用户进分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.moveUserToGroup(openid, groupId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {String} openid 用户的openid
 * @param {Number} groupId 分组ID
 * @param {Function} callback 回调函数
 */
exports.moveUserToGroup = function (openid, groupId, callback) {
  this.preRequest(this._moveUserToGroup, arguments);
};

/*!
 * 移动用户进分组的未封装版本
 */
exports._moveUserToGroup = function (openid, groupId, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"openid":"oDF3iYx0ro3_7jD4HFRDfrjdCM58","to_groupid":108}
  var url = this.prefix + 'groups/members/update?access_token=' + this.token.accessToken;
  var data = {
    "openid": openid,
    "to_groupid": groupId
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};
