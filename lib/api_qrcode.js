var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建临时二维码
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码>
 * Examples:
 * ```
 * api.createTmpQRCode(10000, 1800, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA==",
 *  "expire_seconds":1800
 * }
 * ```
 * @param {Number} sceneId 场景ID
 * @param {Number} expire 过期时间，单位秒。最大不超过1800
 * @param {Function} callback 回调函数
 */
exports.createTmpQRCode = function (sceneId, expire, callback) {
  this.preRequest(this._createTmpQRCode, arguments);
};

/*!
 * 创建临时二维码的未封装版本
 */
exports._createTmpQRCode = function (sceneId, expire, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token.accessToken;
  var data = {
    "expire_seconds": expire,
    "action_name": "QR_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建永久二维码
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码>
 * Examples:
 * ```
 * api.createLimitQRCode(100, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA=="
 * }
 * ```
 * @param {Number} sceneId 场景ID。ID不能大于100000
 * @param {Function} callback 回调函数
 */
exports.createLimitQRCode = function (sceneId, callback) {
  this.preRequest(this._createLimitQRCode, arguments);
};

/*!
 * 创建永久二维码的未封装版本
 */
exports._createLimitQRCode = function (sceneId, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token.accessToken;
  var data = {
    "action_name": "QR_LIMIT_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 生成显示二维码的链接。微信扫描后，可立即进入场景
 * Examples:
 * ```
 * api.showQRCodeURL(titck);
 * // => https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET
 * ```
 * @param {String} ticket 二维码Ticket
 * @return {String} 显示二维码的URL地址，通过img标签可以显示出来
 */
exports.showQRCodeURL = function (ticket) {
  return this.mpPrefix + 'showqrcode?ticket=' + ticket;
};
