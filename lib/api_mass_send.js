var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 上传多媒体文件，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.uploadNews(news, callback);
 * ```
 * News:
 * ```
 * {
 *  "articles": [
 *    {
 *      "thumb_media_id":"qI6_Ze_6PtV7svjolgs-rN6stStuHIjs9_DidOHaj0Q-mwvBelOXCFZiq2OsIU-p",
 *      "author":"xxx",
 *      "title":"Happy Day",
 *      "content_source_url":"www.qq.com",
 *      "content":"content",
 *      "digest":"digest",
 *      "show_cover_pic":"1"
 *   },
 *   {
 *      "thumb_media_id":"qI6_Ze_6PtV7svjolgs-rN6stStuHIjs9_DidOHaj0Q-mwvBelOXCFZiq2OsIU-p",
 *      "author":"xxx",
 *      "title":"Happy Day",
 *      "content_source_url":"www.qq.com",
 *      "content":"content",
 *      "digest":"digest",
 *      "show_cover_pic":"0"
 *   }
 *  ]
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
 *  "type":"news",
 *  "media_id":"CsEf3ldqkAYJAU6EJeIkStVDSvffUJ54vqbThMgplD-VJXXof6ctX5fI6-aYyUiQ",
 *  "created_at":1391857799
 * }
 * ```
 *
 * @param {Object} news 图文消息对象
 * @param {Function} callback 回调函数
 */
exports.uploadNews = function (news, callback) {
  this.preRequest(this._uploadNews, arguments);
};

/*!
 * 上传图文消息的未封装版本
 */
exports._uploadNews = function (news, callback) {
  // https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=ACCESS_TOKEN
  var url = this.prefix + 'media/uploadnews?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(news), wrapper(callback));
};

/**
 * 将通过上传下载多媒体文件得到的视频media_id变成视频素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.uploadMPVideo(opts, callback);
 * ```
 * Opts:
 * ```
 * {
 *  "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
 *  "title": "TITLE",
 *  "description": "Description"
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
 *  "type":"video",
 *  "media_id":"IhdaAQXuvJtGzwwc0abfXnzeezfO0NgPK6AQYShD8RQYMTtfzbLdBIQkQziv2XJc",
 *  "created_at":1391857799
 * }
 * ```
 *
 * @param {Object} opts 待上传为素材的视频
 * @param {Function} callback 回调函数
 */
exports.uploadMPVideo = function (opts, callback) {
  this.preRequest(this._uploadMPVideo, arguments);
};

/*!
 * 上传视频消息的未封装版本
 */
exports._uploadMPVideo = function (opts, callback) {
  // https://file.api.weixin.qq.com/cgi-bin/media/uploadvideo?access_token=ACCESS_TOKEN
  var url = this.fileServerPrefix + 'media/uploadvideo?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 群发消息，分别有图文（news）、文本(text)、语音（voice）、图片（image）和视频（video）
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSend(opts, receivers, callback);
 * ```
 * opts:
 * ```
 * {
 *  "image":{
 *    "media_id":"123dsdajkasd231jhksad"
 *  },
 *  "msgtype":"image"
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
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {Object} opts 待发送的数据
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSend = function (opts, receivers, callback) {
  this.preRequest(this._massSend, arguments);
};

/*!
 * 群发消息的未封装版本
 */
exports._massSend = function (opts, receivers, callback) {
  var url;
  if (Array.isArray(receivers)) {
    opts.touser = receivers;
    url = this.prefix + 'message/mass/send?access_token=' + this.token.accessToken;
  } else {
    opts.filter = {
      "group_id": receivers
    };
    url = this.prefix + 'message/mass/sendall?access_token=' + this.token.accessToken;
  }
  // https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=ACCESS_TOKEN
//  var url = this.prefix + 'message/mass/sendall?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(opts), wrapper(callback));
};

/**
 * 群发图文（news）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSendNews(mediaId, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 图文消息的media id
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendNews = function (mediaId, receivers, callback) {
  var opts = {
    "mpnews": {
      "media_id": mediaId
    },
    "msgtype": "mpnews"
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发文字（text）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSendText(content, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} content 文字消息内容
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendText = function (content, receivers, callback) {
  var opts = {
    "text": {
      "content": content
    },
    "msgtype": "text"
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发声音（voice）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSendVoice(media_id, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 声音media id
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendVoice = function (mediaId, receivers, callback) {
  var opts = {
    "voice": {
      "media_id": mediaId
    },
    "msgtype": "voice"
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发图片（image）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSendImage(media_id, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 图片media id
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendImage = function (mediaId, receivers, callback) {
  var opts = {
    "image": {
      "media_id": mediaId
    },
    "msgtype": "image"
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发视频（video）消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSendVideo(mediaId, receivers, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {String} mediaId 视频media id
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendVideo = function (mediaId, receivers, callback) {
  var opts = {
    "mpvideo": {
      "media_id": mediaId
    },
    "msgtype": "mpvideo"
  };
  this.massSend(opts, receivers, callback);
};

/**
 * 群发视频（video）消息，直接通过上传文件得到的media id进行群发（自动生成素材）
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.massSendMPVideo(data, receivers, callback);
 * ```
 * Data:
 * ```
 * {
 *  "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
 *  "title": "TITLE",
 *  "description": "Description"
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
 *  "errcode":0,
 *  "errmsg":"send job submission success",
 *  "msg_id":34182
 * }
 * ```
 *
 * @param {Object} data 视频数据
 * @param {String/Array} receivers 接收人。一个组，或者openid列表
 * @param {Function} callback 回调函数
 */
exports.massSendMPVideo = function (data, receivers, callback) {
  var that = this;
  // 自动帮转视频的media_id
  this.uploadMPVideo(data, function (err, result) {
    if (err) {
      return callback(err);
    }
    that.massSendVideo(result.media_id, receivers, callback);
  });
};

/**
 * 删除群发消息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=高级群发接口>
 * Examples:
 * ```
 * api.deleteMass(message_id, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode":0,
 *  "errmsg":"ok"
 * }
 * ```
 *
 * @param {String} messageId 待删除群发的消息id
 * @param {Function} callback 回调函数
 */
exports.deleteMass = function (messageId, callback) {
  this.preRequest(this._deleteMass, arguments);
};

exports._deleteMass = function (messageId, callback) {
  var opts = {
    msgid: messageId
  };
  var url = this.prefix + 'message/mass/delete?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(opts), wrapper(callback));
};
