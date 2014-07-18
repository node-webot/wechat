var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 增加货架
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.createShelf(shelf, callback);
 * ```
 * Shelf:
 * ```
 * {
 *   "shelf_data": {
 *     "module_infos": [
 *     {
 *       "group_info": {
 *         "filter": {
 *           "count": 2
 *         },
 *         "group_id": 50
 *       },
 *       "eid": 1
 *     },
 *     {
 *       "group_infos": {
 *         "groups": [
 *           {
 *             "group_id": 49
 *           },
 *           {
 *             "group_id": 50
 *           },
 *           {
 *             "group_id": 51
 *           }
 *         ]
 *       },
 *       "eid": 2
 *     },
 *     {
 *       "group_info": {
 *         "group_id": 52,
 *         "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5Jm64z4I0TTicv0TjN7Vl9bykUUibYKIOjicAwIt6Oy0Y6a1Rjp5Tos8tg/0"
 *       },
 *       "eid": 3
 *     },
 *     {
 *       "group_infos": {
 *         "groups": [
 *           {
 *             "group_id": 49,
 *             "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5uUQx7TLx4tB9qZfbe3JmqR4NkkEmpb5LUWoXF1ek9nga0IkeSSFZ8g/0"
 *           },
 *           {
 *             "group_id": 50,
 *             "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5G1kdy3ViblHrR54gbCmbiaMnl5HpLGm5JFeENyO9FEZAy6mPypEpLibLA/0"
 *           },
 *           {
 *             "group_id": 52,
 *             "img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5uUQx7TLx4tB9qZfbe3JmqR4NkkEmpb5LUWoXF1ek9nga0IkeSSFZ8g/0"
 *           }
 *         ]
 *       },
 *       "eid": 4
 *     },
 *     {
 *       "group_infos": {
 *         "groups": [
 *           {
 *             "group_id": 43
 *           },
 *           {
 *             "group_id": 44
 *           },
 *           {
 *             "group_id": 45
 *           },
 *           {
 *             "group_id": 46
 *           }
 *         ],
 *       "img_background": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl29nqqObBwFwnIX3licVPnFV5uUQx7TLx4tB9qZfbe3JmqR4NkkEmpb5LUWoXF1ek9nga0IkeSSFZ8g/0"
 *       },
 *       "eid": 5
 *     }
 *     ]
 *   },
 *   "shelf_banner": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2ibrWQn8zWFUh1YznsMV0XEiavFfLzDWYyvQOBBszXlMaiabGWzz5B2KhNn2IDemHa3iarmCyribYlZYyw/0",
 *   "shelf_name": "测试货架"
 * }
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
 *   "shelf_id": 12
 * }
 * ```
 * @param {Object} shelf 货架信息
 * @param {Function} callback 回调函数
 */
exports.createShelf = function (shelf, callback) {
  this.preRequest(this._createShelf, arguments);
};

/*!
 * 增加货架的未封装版本
 */
exports._createShelf = function (shelf, callback) {
  var url = this.merchantPrefix + 'shelf/add?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(shelf), wrapper(callback));
};

/**
 * 删除货架
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.deleteShelf(shelfId, callback);
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
 *   "errmsg": "success"
 * }
 * ```
 * @param {String} shelfId 货架Id
 * @param {Function} callback 回调函数
 */
exports.deleteShelf = function (shelfId, callback) {
  this.preRequest(this._deleteShelf, arguments);
};

/*!
 * 删除货架的未封装版本
 */
exports._deleteShelf = function (shelfId, callback) {
  var data = {
    "shelf_id": shelfId
  };
  var url = this.merchantPrefix + 'shelf/del?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 修改货架
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.updateShelf(shelf, callback);
 * ```
 * Shelf:
 * ```
 * {
 *   "shelf_id": 12345,
 *   "shelf_data": ...,
 *   "shelf_banner": "http://mmbiz.qpic.cn/mmbiz/ 4whpV1VZl2ibrWQn8zWFUh1YznsMV0XEiavFfLzDWYyvQOBBszXlMaiabGWzz5B2K hNn2IDemHa3iarmCyribYlZYyw/0",
 *   "shelf_name": "货架名称"
 * }
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
 *   "errmsg": "success"
 * }
 * ```
 * @param {Object} shelf 货架信息
 * @param {Function} callback 回调函数
 */
exports.updateShelf = function (shelf, callback) {
  this.preRequest(this._updateShelf, arguments);
};

/*!
 * 修改货架的未封装版本
 */
exports._updateShelf = function (shelf, callback) {
  var url = this.merchantPrefix + 'shelf/mod?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(shelf), wrapper(callback));
};

/**
 * 获取所有货架
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.getAllShelf(callback);
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
 *   "shelves": [
 *     {
 *       "shelf_info": {
 *       "module_infos": [
 *         {
 *         "group_infos": {
 *           "groups": [
 *           {
 *             "group_id": 200080093
 *           },
 *           {
 *             "group_id": 200080118
 *           },
 *           {
 *             "group_id": 200080119
 *           },
 *           {
 *             "group_id": 200080135
 *           }
 *           ],
 *           "img_background": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl294FzPwnf9dAcaN7ButStztAZyy2yHY8pW6sTQKicIhAy5F0a2CqmrvDBjMFLtc2aEhAQ7uHsPow9A/0"
 *         },
 *         "eid": 5
 *         }
 *       ]
 *       },
 *       "shelf_banner": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl294FzPwnf9dAcaN7ButStztAZyy2yHY8pW6sTQKicIhAy5F0a2CqmrvDBjMFLtc2aEhAQ7uHsPow9A/0",
 *       "shelf_name": "新新人类",
 *       "shelf_id": 22
 *     },
 *     {
 *       "shelf_info": {
 *       "module_infos": [
 *         {
 *           "group_info": {
 *             "group_id": 200080119,
 *             "filter": {
 *               "count": 4
 *             }
 *           },
 *           "eid": 1
 *         }
 *       ]
 *       },
 *       "shelf_banner": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl294FzPwnf9dAcaN7ButStztAZyy2yHY8pW6sTQKicIhAy5F0a2CqmrvDBjMFLtc2aEhAQ7uHsPow9A/0",
 *       "shelf_name": "店铺",
 *       "shelf_id": 23
 *     }
 *   ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getAllShelves = function (callback) {
  this.preRequest(this._getAllShelves, arguments);
};

/*!
 * 获取所有货架的未封装版本
 */
exports._getAllShelves = function (callback) {
  var url = this.merchantPrefix + 'shelf/getall?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 根据货架ID获取货架信息
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.getShelfById(shelfId, callback);
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
 *   "shelf_info": {
 *     "module_infos": [...]
 *   },
 *   "shelf_banner": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2ibp2DgDXiaic6WdflMpNdInS8qUia2BztlPu1gPlCDLZXEjia2qBdjoLiaCGUno9zbs1UyoqnaTJJGeEew/0",
 *   "shelf_name": "新建货架",
 *   "shelf_id": 97
 * }
 * ```
 * @param {String} shelfId 货架Id
 * @param {Function} callback 回调函数
 */
 exports.getShelfById = function (shelfId, callback) {
   this.preRequest(this._getShelfById, arguments);
 };

/*!
 * 根据货架ID获取货架信息的未封装版本
 */
exports._getShelfById = function (shelfId, callback) {
  var data = {
    "shelf_id": shelfId
  };
  var url = this.merchantPrefix + 'shelf/getbyid?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};
