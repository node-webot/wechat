var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 微信公众号支付: 发货通知
 * 详情请见：<http://mp.weixin.qq.com/htmledition/res/bussiness-faq/wx_mp_pay.zip> 接口文档订单发货通知
 *
 * Data:
 * ```
 * {
 *   "appid" : "wwwwb4f85f3a797777",
 *   "openid" : "oX99MDgNcgwnz3zFN3DNmo8uwa-w",
 *   "transid" : "111112222233333",
 *   "out_trade_no" : "555666uuu",
 *   "deliver_timestamp" : "1369745073",
 *   "deliver_status" : "1",
 *   "deliver_msg" : "ok",
 *   "app_signature" : "53cca9d47b883bd4a5c85a9300df3da0cb48565c",
 *   "sign_method" : "sha1"
 * }
 * ```
 * Examples:
 * ```
 * api.deliverNotify(data, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode":0, "errmsg":"ok"}
 * ```
 *
 * @param {Object} package package对象
 * @param {Function} callback 回调函数
 */
exports.deliverNotify = function (data, callback) {
  this.preRequest(this._deliverNotify, arguments);
};

/*!
 * 发货通知的未封装版本
 */
exports._deliverNotify = function (data, callback) {
  var url = this.payPrefix + 'delivernotify?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 微信公众号支付: 订单查询
 * 详情请见：<http://mp.weixin.qq.com/htmledition/res/bussiness-faq/wx_mp_pay.zip> 接口文档订单查询部分
 *
 * Package:
 * ```
 * {
 *   "appid" : "wwwwb4f85f3a797777",
 *   "package" : "out_trade_no=11122&partner=1900090055&sign=4e8d0df3da0c3d0df38f",
 *   "timestamp" : "1369745073",
 *   "app_signature" : "53cca9d47b883bd4a5c85a9300df3da0cb48565c",
 *   "sign_method" : "sha1"
 * }
 * ```
 * Examples:
 * ```
 * api.orderQuery(query, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode":0,
 *   "errmsg":"ok",
 *   "order_info": {
 *     "ret_code":0,
 *     "ret_msg":"",
 *     "input_charset":"GBK",
 *     "trade_state":"0",
 *     "trade_mode":"1",
 *     "partner":"1900000109",
 *     "bank_type":"CMB_FP",
 *     "bank_billno":"207029722724",
 *     "total_fee":"1",
 *     "fee_type":"1",
 *     "transaction_id":"1900000109201307020305773741",
 *     "out_trade_no":"2986872580246457300",
 *     "is_split":"false",
 *     "is_refund":"false",
 *     "attach":"",
 *     "time_end":"20130702175943",
 *     "transport_fee":"0",
 *     "product_fee":"1",
 *     "discount":"0",
 *     "rmb_total_fee":""
 *   }
 * }
 * ```
 *
 * @param {Object} query query对象
 * @param {Function} callback 回调函数
 */
exports.orderQuery = function (query, callback) {
  this.preRequest(this._orderQuery, arguments);
};

/*!
 * 发货通知的未封装版本
 */
exports._orderQuery = function (query, callback) {
  var url = this.payPrefix + 'orderquery?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(query), wrapper(callback));
};
