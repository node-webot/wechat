var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 根据订单Id获取订单详情
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.getOrderById(orderId, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "success",
 *   "order": {
 *     "order_id": "7197417460812533543",
 *     "order_status": 6,
 *     "order_total_price": 6,
 *     "order_create_time": 1394635817,
 *     "order_express_price": 5,
 *     "buyer_openid": "oDF3iY17NsDAW4UP2qzJXPsz1S9Q",
 *     "buyer_nick": "likeacat",
 *     "receiver_name": "张小猫",
 *     "receiver_province": "广东省",
 *     "receiver_city": "广州市",
 *     "receiver_address": "华景路一号南方通信大厦5楼",
 *     "receiver_mobile": "123456789",
 *     "receiver_phone": "123456789",
 *     "product_id": "pDF3iYx7KDQVGzB7kDg6Tge5OKFo",
 *     "product_name": "安莉芳E-BRA专柜女士舒适内衣蕾丝3/4薄杯聚拢上托性感文胸KB0716",
 *     "product_price": 1,
 *     "product_sku": "10000983:10000995;10001007:10001010",
 *     "product_count": 1,
 *     "product_img": "http://img2.paipaiimg.com/00000000/item-52B87243-63CCF66C00000000040100003565C1EA.0.300x300.jpg",
 *     "delivery_id": "1900659372473",
 *     "delivery_company": "059Yunda",
 *     "trans_id": "1900000109201404103172199813"
 *   }
 * }
 * ```
 * @param {String} orderId 订单Id
 * @param {Function} callback 回调函数
 */
exports.getOrderById = function (orderId, callback) {
  this.preRequest(this._getOrderById, arguments);
};

/*!
 * 根据订单ID获取订单详情的未封装版本
 */
exports._getOrderById = function (orderId, callback) {
  var data = {
    "order_id": orderId
  };
  var url = this.merchantPrefix + 'order/getbyid?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 根据订单状态/创建时间获取订单详情
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.getOrdersByStatus([status,] [beginTime,] [endTime,] callback);
 * ```
 * Usage:
 * 当只传入callback参数时，查询所有状态，所有时间的订单
 * 当传入两个参数，第一个参数为Number类型，第二个参数为callback时，查询指定状态，所有时间的订单
 * 当传入两个参数，第一个参数为Date类型，第二个参数为callback时，查询所有状态，指定订单创建起始时间的订单(待测试)
 * 当传入三个参数，第一参数为订单状态码，第二参数为订单创建起始时间，第三参数为callback
 * 当传入四个参数，第一参数为订单状态码，第二参数为订单创建起始时间，第三参数为订单创建终止时间，第四参数为callback
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "success",
 *   "order_list": [
 *     {
 *       "order_id": "7197417460812533543",
 *       "order_status": 6,
 *       "order_total_price": 6,
 *       "order_create_time": 1394635817,
 *       "order_express_price": 5,
 *       "buyer_openid": "oDF3iY17NsDAW4UP2qzJXPsz1S9Q",
 *       "buyer_nick": "likeacat",
 *       "receiver_name": "张小猫",
 *       "receiver_province": "广东省",
 *       "receiver_city": "广州市",
 *       "receiver_address": "华景路一号南方通信大厦5楼",
 *       "receiver_mobile": "123456",
 *       "receiver_phone": "123456",
 *       "product_id": "pDF3iYx7KDQVGzB7kDg6Tge5OKFo",
 *       "product_name": "安莉芳E-BRA专柜女士舒适内衣蕾丝3/4薄杯聚拢上托性感文胸KB0716",
 *       "product_price": 1,
 *       "product_sku": "10000983:10000995;10001007:10001010",
 *       "product_count": 1,
 *       "product_img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2icND8WwMThBEcehjhDv2icY4GrDSG5RLM3B2qd9kOicWGVJcsAhvXfibhWRNoGOvCfMC33G9z5yQr2Qw/0",
 *       "delivery_id": "1900659372473",
 *       "delivery_company": "059Yunda",
 *       "trans_id": "1900000109201404103172199813"
 *     },
 *     {
 *       "order_id": "7197417460812533569",
 *       "order_status": 8,
 *       "order_total_price": 1,
 *       "order_create_time": 1394636235,
 *       "order_express_price": 0,
 *       "buyer_openid": "oDF3iY17NsDAW4UP2qzJXPsz1S9Q",
 *       "buyer_nick": "likeacat",
 *       "receiver_name": "张小猫",
 *       "receiver_province": "广东省",
 *       "receiver_city": "广州市",
 *       "receiver_address": "华景路一号南方通信大厦5楼",
 *       "receiver_mobile": "123456",
 *       "receiver_phone": "123456",
 *       "product_id": "pDF3iYx7KDQVGzB7kDg6Tge5OKFo",
 *       "product_name": "项坠333",
 *       "product_price": 1,
 *       "product_sku": "1075741873:1079742377",
 *       "product_count": 1,
 *       "product_img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2icND8WwMThBEcehjhDv2icY4GrDSG5RLM3B2qd9kOicWGVJcsAhvXfibhWRNoGOvCfMC33G9z5yQr2Qw/0",
 *       "delivery_id": "1900659372473",
 *       "delivery_company": "059Yunda",
 *       "trans_id": "1900000109201404103172199813"
 *     }
 *   ]
 * }
 * ```
 * @param {Number} status 状态码。(无此参数-全部状态, 2-待发货, 3-已发货, 5-已完成, 8-维权中)
 * @param {Date} beginTime 订单创建时间起始时间。(无此参数则不按照时间做筛选)
 * @param {Date} endTime 订单创建时间终止时间。(无此参数则不按照时间做筛选)
 * @param {Function} callback 回调函数
 */
exports.getOrdersByStatus = function () {
  this.preRequest(this._getOrdersByStatus, arguments);
};

/*!
 * 根据订单状态/创建时间获取订单详情的未封装版本
 */
exports._getOrdersByStatus = function (status, beginTime, endTime, callback) {
  var data = {};
  if (arguments.length === 1 && typeof status === 'function') {
    // (callback);
    callback = status;
  } else if (arguments.length === 2 && typeof beginTime === 'function') {
    callback = beginTime;
    if (typeof status === 'number') {
      // (status, callback)
      data.status = status;
    } else if (status instanceof Date) {
      data.begintime = Math.round(status.getTime() / 1000);
      data.endtime = Math.round(new Date().getTime() / 1000);
    } else {
      callback(new Error('first parameter must be Number or Date'));
    }
  } else if (arguments.length === 3 && typeof endTime === 'function') {
    callback = endTime;
    if (typeof status === 'number' && beginTime instanceof Date) {
      data.status = status;
      data.begintime = Math.round(beginTime.getTime() / 1000);
      data.endtime = Math.round(new Date().getTime() / 1000);
    } else {
      callback(new Error('first parameter must be Number and second parameter must be Date'));
    }
  } else if (arguments.length === 4) {
    data.status = status;
    data.begintime = Math.round(beginTime.getTime() / 1000);
    data.endtime = Math.round(endTime.getTime() / 1000);
  }
  var url = this.merchantPrefix + 'order/getbyfilter?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 设置订单发货信息
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.setExpressForOrder(orderId, deliveryCompany, deliveryTrackNo, callback);
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
 * @param {String} orderId 订单Id
 * @param {String} deliveryCompany 物流公司 (物流公司Id请参考微信小店API手册)
 * @param {String} deliveryTrackNo 运单Id
 * @param {Function} callback 回调函数
 */
exports.setExpressForOrder = function (orderId, deliveryCompany, deliveryTrackNo, callback) {
  this.preRequest(this._setExpressForOrder, arguments);
};

/*!
 * 设置订单发货信息的未封装版本
 */
exports._setExpressForOrder = function (orderId, deliveryCompany, deliveryTrackNo, callback) {
  var data = {
    "order_id": orderId,
    "delivery_company": deliveryCompany,
    "delivery_track_no": deliveryTrackNo
  };
  var url = this.merchantPrefix + 'order/setdelivery?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 关闭订单
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.closeOrder(orderId, callback);
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
 * @param {String} orderId 订单Id
 * @param {Function} callback 回调函数
 */
exports.closeOrder = function (orderId, callback) {
  this.preRequest(this._closeOrder, arguments);
};

/*!
 * 关闭订单的未封装版本
 */
exports._closeOrder = function (orderId, callback) {
  var data = {
    "order_id": orderId
  };
  var url = this.merchantPrefix + 'order/close?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};
