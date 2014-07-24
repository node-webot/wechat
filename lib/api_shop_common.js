var urllib = require('urllib');
var path = require('path');
var fs = require('fs');
var util = require('./util');
var wrapper = util.wrapper;

/**
 * 上传图片
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口>
 * Examples:
 * ```
 * api.uploadPicture('/path/to/your/img.jpg', callback);
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
 *  "image_url": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2ibl4JWwwnW3icSJGqecVtRiaPxwWEIr99eYYL6AAAp1YBo12CpQTXFH6InyQWXITLvU4CU7kic4PcoXA/0"
 * }
 * ```
 * @param {String} filepath 文件路径
 * @param {Function} callback 回调函数
 */
exports.uploadPicture = function (filepath, callback) {
  this.preRequest(this._uploadPicture, arguments);
};

/*!
 * 更新商品库存的未封装版本
 */
exports._uploadPicture = function (filepath, callback) {
  var basename = path.basename(filepath);
  var url = this.merchantPrefix + 'common/upload_img?access_token=' +
    this.token.accessToken + '&filename=' + basename;
  var reader = fs.createReadStream(filepath);
  var opts = {
    dataType: 'json',
    type: 'POST',
    stream: reader
  };
  urllib.request(url, opts, wrapper(callback));
};
