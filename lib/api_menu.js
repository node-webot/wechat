var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建自定义菜单
 * 详细请看：http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单创建接口
 *
 * Menu:
 * ```
 * {
 *  "button":[
 *    {
 *      "type":"click",
 *      "name":"今日歌曲",
 *      "key":"V1001_TODAY_MUSIC"
 *    },
 *    {
 *      "name":"菜单",
 *      "sub_button":[
 *        {
 *          "type":"view",
 *          "name":"搜索",
 *          "url":"http://www.soso.com/"
 *        },
 *        {
 *          "type":"click",
 *          "name":"赞一下我们",
 *          "key":"V1001_GOOD"
 *        }]
 *      }]
 *    }
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.createMenu(menu, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 * @param {Object} menu 菜单对象
 * @param {Function} callback 回调函数
 */
exports.createMenu = function (menu, callback) {
  this.preRequest(this._createMenu, arguments);
};

/*!
 * 创建自定义菜单的未封装版本
 */
exports._createMenu = function (menu, callback) {
  var url = this.prefix + 'menu/create?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(menu), wrapper(callback));
};

/**
 * 获取菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单查询接口>
 *
 * Examples:
 * ```
 * api.getMenu(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * // 结果示例
 * {
 *  "menu": {
 *    "button":[
 *      {"type":"click","name":"今日歌曲","key":"V1001_TODAY_MUSIC","sub_button":[]},
 *      {"type":"click","name":"歌手简介","key":"V1001_TODAY_SINGER","sub_button":[]},
 *      {"name":"菜单","sub_button":[
 *        {"type":"view","name":"搜索","url":"http://www.soso.com/","sub_button":[]},
 *        {"type":"view","name":"视频","url":"http://v.qq.com/","sub_button":[]},
 *        {"type":"click","name":"赞一下我们","key":"V1001_GOOD","sub_button":[]}]
 *      }
 *    ]
 *  }
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getMenu = function (callback) {
  this.preRequest(this._getMenu, arguments);
};

/*!
 * 获取自定义菜单的未封装版本
 */
exports._getMenu = function (callback) {
  var url = this.prefix + 'menu/get?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 删除自定义菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单删除接口>
 * Examples:
 * ```
 * api.removeMenu(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 * @param {Function} callback 回调函数
 */
exports.removeMenu = function (callback) {
  this.preRequest(this._removeMenu, arguments);
};

/*!
 * 删除自定义菜单的未封装版本
 */
exports._removeMenu = function (callback) {
  var url = this.prefix + 'menu/delete?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};
