var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 增加邮费模板
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.addExpress(express, callback);
 * ```
 * Express:
 * ```
 * {
 *  "delivery_template": {
 *    "Name": "testexpress",
 *    "Assumer": 0,
 *    "Valuation": 0,
 *    "TopFee": [
 *      {
 *        "Type": 10000027,
 *        "Normal": {
 *          "StartStandards": 1,
 *          "StartFees": 2,
 *          "AddStandards": 3,
 *          "AddFees": 1
 *        },
 *        "Custom": [
 *          {
 *            "StartStandards": 1,
 *            "StartFees": 100,
 *            "AddStandards": 1,
 *            "AddFees": 3,
 *            "DestCountry": "中国",
 *            "DestProvince": "广东省",
 *            "DestCity": "广州市"
 *          }
 *        ]
 *      },
 *      {
 *        "Type": 10000028,
 *        "Normal": {
 *          "StartStandards": 1,
 *          "StartFees": 3,
 *          "AddStandards": 3,
 *          "AddFees": 2
 *        },
 *        "Custom": [
 *          {
 *            "StartStandards": 1,
 *            "StartFees": 10,
 *            "AddStandards": 1,
 *            "AddFees": 30,
 *            "DestCountry": "中国",
 *            "DestProvince": "广东省",
 *            "DestCity": "广州市"
 *          }
 *        ]
 *      },
 *      {
 *        "Type": 10000029,
 *        "Normal": {
 *          "StartStandards": 1,
 *          "StartFees": 4,
 *          "AddStandards": 3,
 *          "AddFees": 3
 *        },
 *        "Custom": [
 *          {
 *            "StartStandards": 1,
 *            "StartFees": 8,
 *            "AddStandards": 2,
 *            "AddFees": 11,
 *            "DestCountry": "中国",
 *            "DestProvince": "广东省",
 *            "DestCity": "广州市"
 *          }
 *        ]
 *      }
 *    ]
 *  }
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
 *  "errcode": 0,
 *  "errmsg": "success"
 *  "template_id": 123456
 * }
 * ```
 * @param {Object} express 邮费模版
 * @param {Function} callback 回调函数
 */
exports.addExpressTemplate = function (express, callback) {
  this.preRequest(this._addExpressTemplate, arguments);
};

/*!
 * 增加邮费模板的未封装版本
 */
exports._addExpressTemplate = function (express, callback) {
  var url = this.merchantPrefix + 'express/add?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(express), wrapper(callback));
};

/**
 * 修改邮费模板
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.deleteExpressTemplate(templateId, callback);
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
 * @param {Number} templateId 邮费模版ID
 * @param {Function} callback 回调函数
 */
exports.deleteExpressTemplate = function (templateId, callback) {
  this.preRequest(this._deleteExpressTemplate, arguments);
};

/*!
 * 增加邮费模板的未封装版本
 */
exports._deleteExpressTemplate = function (templateId, callback) {
  var data = {
    template_id: templateId
  };
  var url = this.merchantPrefix + 'express/del?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 修改邮费模板
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.updateExpressTemplate(template, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Express:
 * ```
 * {
 *  "template_id": 123456,
 *  "delivery_template": ...
 * }
 * ```
 * Result:
 * ```
 * {
 *  "errcode": 0,
 *  "errmsg": "success"
 * }
 * ```
 * @param {Object} template 邮费模版
 * @param {Function} callback 回调函数
 */
exports.updateExpressTemplate = function (template, callback) {
  this.preRequest(this._updateExpressTemplate, arguments);
};

/*!
 * 修改邮费模板的未封装版本
 */
exports._updateExpressTemplate = function (template, callback) {
  var url = this.merchantPrefix + 'express/del?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(template), wrapper(callback));
};

/**
 * 获取指定ID的邮费模板
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.getExpressTemplateById(templateId, callback);
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
 *  "errmsg": "success",
 *  "template_info": {
 *    "Id": 103312916,
 *    "Name": "testexpress",
 *    "Assumer": 0,
 *    "Valuation": 0,
 *    "TopFee": [
 *      {
 *        "Type": 10000027,
 *        "Normal": {
 *          "StartStandards": 1,
 *          "StartFees": 2,
 *          "AddStandards": 3,
 *          "AddFees": 1
 *        },
 *        "Custom": [
 *          {
 *            "StartStandards": 1,
 *            "StartFees": 1000,
 *            "AddStandards": 1,
 *            "AddFees": 3,
 *            "DestCountry": "中国",
 *            "DestProvince": "广东省",
 *            "DestCity": "广州市"
 *          }
 *        ]
 *      },
 *      ...
 *    ]
 *  }
 * }
 * ```
 * @param {Number} templateId 邮费模版Id
 * @param {Function} callback 回调函数
 */
exports.getExpressTemplateById = function (templateId, callback) {
  this.preRequest(this._getExpressTemplateById, arguments);
};

/*!
 * 获取指定ID的邮费模板的未封装版本
 */
exports._getExpressTemplateById = function (templateId, callback) {
  var data = {
    template_id: templateId
  };
  var url = this.merchantPrefix + 'express/getbyid?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 获取所有邮费模板的未封装版本
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.getAllExpressTemplates(callback);
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
 *  "errmsg": "success",
 *  "templates_info": [
 *    {
 *      "Id": 103312916,
 *      "Name": "testexpress1",
 *      "Assumer": 0,
 *      "Valuation": 0,
 *      "TopFee": [...],
 *    },
 *    {
 *      "Id": 103312917,
 *      "Name": "testexpress2",
 *      "Assumer": 0,
 *      "Valuation": 2,
 *      "TopFee": [...],
 *    },
 *    {
 *      "Id": 103312918,
 *      "Name": "testexpress3",
 *      "Assumer": 0,
 *      "Valuation": 1,
 *      "TopFee": [...],
 *    }
 *  ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getAllExpressTemplates = function (callback) {
  this.preRequest(this._getAllExpressTemplates, arguments);
};

/*!
 * 获取所有邮费模板的未封装版本
 */
exports._getAllExpressTemplates = function (callback) {
  var url = this.merchantPrefix + 'express/getall?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};
