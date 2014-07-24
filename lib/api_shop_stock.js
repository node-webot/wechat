// 库存管理接口
var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 增加库存
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.updateStock(10, productId, sku, callback); // 增加10件库存
 * api.updateStock(-10, productId, sku, callback); // 减少10件库存
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
 * @param {Number} number 增加或者删除的数量
 * @param {String} productId 商品ID
 * @param {String} sku SKU信息
 * @param {Function} callback 回调函数
 */
exports.updateStock = function (number, productId, sku, callback) {
  this.preRequest(this._updateStock, arguments);
};

/*!
 * 更新商品库存的未封装版本
 */
exports._updateStock = function (number, productId, sku, callback) {
  var url;
  if (number > 0) {
    url = this.merchantPrefix + 'stock/add?access_token=' + this.token.accessToken;
  } else {
    url = this.merchantPrefix + 'stock/reduce?access_token=' + this.token.accessToken;
  }
  var data = {
    "product_id": productId,
    "sku_info": sku,
    "quantity": Math.abs(number)
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};
