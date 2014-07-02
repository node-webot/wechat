var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 客服消息，发送文字消息
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=发送客服消息
 * Examples:
 * ```
 * api.sendText('openid', 'Hello world', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} text 发送的消息内容
 * @param {Function} callback 回调函数
 */
exports.sendText = function (openid, text, callback) {
  this.preRequest(this._sendText, arguments);
};

/*!
 * 客服消息，发送文字消息的未封装版本
 */
exports._sendText = function (openid, text, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"text",
  //  "text": {
  //    "content":"Hello World"
  //  }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    "touser": openid,
    "msgtype": "text",
    "text": {
      "content": text
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送图片消息
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=发送客服消息
 * Examples:
 * ```
 * api.sendImage('openid', 'media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID，参见uploadMedia方法
 * @param {Function} callback 回调函数
 */
exports.sendImage = function (openid, mediaId, callback) {
  this.preRequest(this._sendImage, arguments);
};

/*!
 * 客服消息，发送图片消息的未封装版本
 */
exports._sendImage = function (openid, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"image",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    "touser": openid,
    "msgtype":"image",
    "image": {
      "media_id": mediaId
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送语音消息
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=发送客服消息
 * Examples:
 * ```
 * api.sendVoice('openid', 'media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID
 * @param {Function} callback 回调函数
 */
exports.sendVoice = function (openid, mediaId, callback) {
  this.preRequest(this._sendVoice, arguments);
};

/*!
 * 客服消息，发送语音消息的未封装版本
 */
exports._sendVoice = function (openid, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"voice",
  //  "voice": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    "touser": openid,
    "msgtype": "voice",
    "voice": {
      "media_id": mediaId
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送视频消息
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=发送客服消息
 * Examples:
 * ```
 * api.sendVideo('openid', 'media_id', 'thumb_media_id', callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID
 * @param {String} thumbMediaId 缩略图文件的ID
 * @param {Function} callback 回调函数
 */
exports.sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  this.preRequest(this._sendVideo, arguments);
};

/*!
 * 客服消息，发送视频消息的未封装版本
 */
exports._sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"video",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    "touser": openid,
    "msgtype":"video",
    "video": {
      "media_id": mediaId,
      "thumb_media_id": thumbMediaId
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送音乐消息
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=发送客服消息
 * Examples:
 * ```
 * var music = {
 *  title: '音乐标题', // 可选
 *  description: '描述内容', // 可选
 *  musicurl: 'http://url.cn/xxx', 音乐文件地址
 *  hqmusicurl: "HQ_MUSIC_URL",
 *  thumb_media_id: "THUMB_MEDIA_ID"
 * };
 * api.sendMusic('openid', music, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {Object} music 音乐文件
 * @param {Function} callback 回调函数
 */
exports.sendMusic = function (openid, music, callback) {
  this.preRequest(this._sendMusic, arguments);
};

/*!
 * 客服消息，发送音乐消息的未封装版本
 */
exports._sendMusic = function (openid, music, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"music",
  //  "music": {
  //    "title":"MUSIC_TITLE", // 可选
  //    "description":"MUSIC_DESCRIPTION", // 可选
  //    "musicurl":"MUSIC_URL",
  //    "hqmusicurl":"HQ_MUSIC_URL",
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    "touser": openid,
    "msgtype":"music",
    "music": music
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 客服消息，发送图文消息
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=发送客服消息
 * Examples:
 * ```
 * var articles = [
 *  {
 *    "title":"Happy Day",
 *    "description":"Is Really A Happy Day",
 *    "url":"URL",
 *    "picurl":"PIC_URL"
 *  },
 *  {
 *    "title":"Happy Day",
 *    "description":"Is Really A Happy Day",
 *    "url":"URL",
 *    "picurl":"PIC_URL"
 *  }];
 * api.sendNews('openid', articles, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * @param {String} openid 用户的openid
 * @param {Array} articles 图文列表
 * @param {Function} callback 回调函数
 */
exports.sendNews = function (openid, articles, callback) {
  this.preRequest(this._sendNews, arguments);
};

/*!
 * 客服消息，发送图文消息的未封装版本
 */
exports._sendNews = function (openid, articles, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"news",
  //  "news":{
  //    "articles": [
  //      {
  //        "title":"Happy Day",
  //        "description":"Is Really A Happy Day",
  //        "url":"URL",
  //        "picurl":"PIC_URL"
  //      },
  //      {
  //        "title":"Happy Day",
  //        "description":"Is Really A Happy Day",
  //        "url":"URL",
  //        "picurl":"PIC_URL"
  //      }]
  //   }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  var data = {
    "touser": openid,
    "msgtype":"news",
    "news": {
      "articles": articles
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};
