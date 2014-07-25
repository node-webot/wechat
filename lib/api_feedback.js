var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;

/**
 * 标记客户的投诉处理状态
 * Examples:
 * ```
 * api.updateFeedback(openid, feedbackId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode": 0,
 *  "errmsg": "success"
 * }
 * ```
 * @param {String} openid 用户ID
 * @param {String} feedbackId 投诉ID
 * @param {Function} callback 回调函数
 */
exports.updateFeedback = function (openid, feedbackId, callback) {
  this.preRequest(this._updateFeedback, arguments);
};

exports._updateFeedback = function (openid, feedbackId, callback) {
  var feedbackUrl = 'https://api.weixin.qq.com/payfeedback/update';
  // https://api.weixin.qq.com/payfeedback/update?access_token=xxxxx&openid=XXXX&feedbackid=xxxx
  var data = {
    'access_token': this.token.accessToken,
    'openid': openid,
    'feedbackid': feedbackId
  };
  var opts = {
    dataType: 'json',
    type: 'GET',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  urllib.request(feedbackUrl, opts, wrapper(callback));
};
