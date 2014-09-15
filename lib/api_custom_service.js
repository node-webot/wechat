var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 获取客服聊天记录
 * 详细请看：http://mp.weixin.qq.com/wiki/index.php?title=获取客服聊天记录
 *
 * Opts:
 * ```
 * {
 *  "starttime" : 123456789,
 *  "endtime" : 987654321,
 *  "openid": "OPENID", // 非必须
 *  "pagesize" : 10,
 *  "pageindex" : 1,
 * }
 * ```
 * Examples:
 * ```
 * api.getRecords(opts, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "recordlist": [
 *    {
 *      "worker": " test1",
 *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
 *      "opercode": 2002,
 *      "time": 1400563710,
 *      "text": " 您好，客服test1为您服务。"
 *    },
 *    {
 *      "worker": " test1",
 *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
 *      "opercode": 2003,
 *      "time": 1400563731,
 *      "text": " 你好，有什么事情？ "
 *    },
 *  ]
 * }
 * ```
 * @param {Object} opts 查询条件
 * @param {Function} callback 回调函数
 */
exports.getRecords = function (opts, callback) {
  this.preRequest(this._getRecords, arguments);
};

/*!
 * 获取客服聊天记录的未封装版本
 */
exports._getRecords = function (opts, callback) {
  // https://api.weixin.qq.com/cgi-bin/customservice/getrecord?access_token=ACCESS_TOKEN
  var url = this.prefix + 'customservice/getrecord?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 获取客服基本信息
 * 详细请看：http://dkf.qq.com/document-3_1.html
 *
 * Examples:
 * ```
 * api.getCustomServiceList(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "kf_list": [
 *     {
 *       "kf_account": "test1@test",
 *       "kf_nick": "ntest1",
 *       "kf_id": "1001"
 *     },
 *     {
 *       "kf_account": "test2@test",
 *       "kf_nick": "ntest2",
 *       "kf_id": "1002"
 *     },
 *     {
 *       "kf_account": "test3@test",
 *       "kf_nick": "ntest3",
 *       "kf_id": "1003"
 *     }
 *   ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getCustomServiceList = function (callback) {
  this.preRequest(this._getCustomServiceList, arguments);
};

/*!
 * 获取客服基本信息的未封装版本
 */
exports._getCustomServiceList = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token= ACCESS_TOKEN
  var url = this.prefix + 'customservice/getkflist?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取在线客服接待信息
 * 详细请看：http://dkf.qq.com/document-3_2.html
 *
 * Examples:
 * ```
 * api.getOnlineCustomServiceList(callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "kf_online_list": [
 *     {
 *       "kf_account": "test1@test",
 *       "status": 1,
 *       "kf_id": "1001",
 *       "auto_accept": 0,
 *       "accepted_case": 1
 *     },
 *     {
 *       "kf_account": "test2@test",
 *       "status": 1,
 *       "kf_id": "1002",
 *       "auto_accept": 0,
 *       "accepted_case": 2
 *     }
 *   ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getOnlineCustomServiceList = function (callback) {
  this.preRequest(this._getOnlineCustomServiceList, arguments);
};

/*!
 * 获取在线客服接待信息的未封装版本
 */
exports._getOnlineCustomServiceList = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token= ACCESS_TOKEN
  var url = this.prefix + 'customservice/getonlinekflist?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};
