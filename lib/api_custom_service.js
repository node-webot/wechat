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
