var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 发送模板消息
 * Examples:
 * ```
 * var template = {
 *  template_id: '模板id',
 *  // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
 *  url: 'http://weixin.qq.com/download',
 *  topcolor: '#FF0000', // 顶部颜色
 *  data:{
 *    user:{
 *      "value":'黄先生',
 *      "color":"#173177"
 *    }
 *  }
 * };
 * api.sendTemplate('openid', template, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} templateId 模板ID
 * @param {String} url URL置空，则在发送后，点击模板消息会进入一个空白页面（ios）.或无法点击（android）.
 * @param {String} topColor 顶部颜色
 * @param {Object} data 渲染模板的数据
 * @param {Function} callback 回调函数
 */
exports.sendTemplate = function (openid, templateId, url, topColor, data, callback) {
  this.preRequest(this._sendTemplate, arguments);
};

exports._sendTemplate = function (openid, templateId, url, topColor, data, callback) {
  var apiUrl = this.prefix + 'message/template/send?access_token=' + this.token.accessToken;
  var template = {
    touser: openid,
    template_id: templateId,
    url: url,
    topcolor: topColor,
    data: data
  };
  urllib.request(apiUrl, postJSON(template), wrapper(callback));
};
