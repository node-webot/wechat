var urllib = require('urllib');

// http://mp.weixin.qq.com/wiki/index.php?title=%E8%BF%94%E5%9B%9E%E7%A0%81%E8%AF%B4%E6%98%8E
var wrapper = function (callback) {
  return function (err, data, res) {
    if (err) {
      err.name = 'WeChatAPI' + err.name;
      return callback(err, data, res);
    }
    if (data.errcode) {
      err = new Error(data.errmsg);
      err.name = 'WeChatAPIError';
      return callback(err, data, res);
    }
    callback(null, data, res);
  };
};

var postJSON = function (data) {
  return {
    dataType: 'json',
    type: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

var API = function (appid, appsecret) {
  this.appid = appid;
  this.appsecret = appsecret;
  this.prefix = 'https://api.weixin.qq.com/cgi-bin/';
};

/**
 * 根据appid和appsecret获取access token
 * @param {String} appid appid
 * @param {String} appsecret secret
 * @param {Function} callback 回调函数
 */
API.prototype.getAccessToken = function (callback) {
  var that = this;
  var url = this.prefix + 'token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
  urllib.request(url, {dataType: 'json'}, wrapper(function (err, data) {
    if (err) {
      return callback(err);
    }
    that.token = data.access_token;
    callback(err, data);
  }));
  return this;
};

/**
 * 创建菜单
 * @param {Object} menu 菜单对象
 * @param {Function} callback 回调函数
 */
API.prototype.createMenu = function (menu, callback) {
  var url = this.prefix + 'menu/create?access_token=' + this.token;
  urllib.request(url, postJSON(menu), wrapper(callback));
};

/**
 * 获取菜单
 * @param {Function} callback 回调函数
 */
API.prototype.getMenu = function (callback) {
  var url = this.prefix + 'menu/get?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 删除菜单
 * @param {Function} callback 回调函数
 */
API.prototype.removeMenu = function (callback) {
  var url = this.prefix + 'menu/delete?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取二维码
 * @param {Object} data 二维码数据
 * @param {Function} callback 回调函数
 */
API.prototype.getQRCode = function (data, callback) {
  var url = this.prefix + 'qrcode/get?access_token=' + this.token;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建临时二维码
 * @param {String} sceneId 场景ID
 * @param {Number} expire 过期时间，单位秒。最大不超过1800
 * @param {Function} callback 回调函数
 */
API.prototype.createTmpQRCode = function (sceneId, expire, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token;
  var data = {
    "expire_seconds": expire,
    "action_name": "QR_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建永久二维码
 * @param {String} sceneId 场景ID。ID不能大于1000
 * @param {Function} callback 回调函数
 */
API.prototype.createLimitQRCode = function (sceneId, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token;
  var data = {
    "action_name": "QR_LIMIT_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 生成显示二维码的链接
 * @param {String} ticket 二维码Ticket
 */
API.prototype.showQRCodeURL = function (ticket) {
  return this.prefix + 'showqrcode?ticket=' + ticket;
};

// ## 分组API http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3
/**
 * 获取分组列表
 */
API.prototype.getGroups = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/get?access_token=ACCESS_TOKEN
  var url = this.prefix + 'groups/get?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 创建分组
 * @param {String} name 分组名字
 */
API.prototype.createGroup = function (name, callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/create?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"name":"test"}}
  var url = this.prefix + 'groups/create?access_token=' + this.token;
  var data = {
    "group": {"name": name}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 更新分组名字
 * @param {Number} id 分组ID
 * @param {String} name 新的分组名字
 */
API.prototype.updateGroup = function (id, name, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"group":{"id":108,"name":"test2_modify2"}}
  var url = this.prefix + 'groups/update?access_token=' + this.token;
  var data = {
    "group": {"id": id, "name": name}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 移动用户进分组
 * @param {String} openid 用户的openid
 * @param {Number} groupId 分组ID
 */
API.prototype.moveUserToGroup = function (openid, groupId, callback) {
  // http请求方式: POST（请使用https协议）
  // https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=ACCESS_TOKEN
  // POST数据格式：json
  // POST数据例子：{"openid":"oDF3iYx0ro3_7jD4HFRDfrjdCM58","to_groupid":108}
  var url = this.prefix + 'groups/update?access_token=' + this.token;
  var data = {
    "openid": openid,
    "to_groupid": groupId
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 获取用户信息
 * @param {String} openid 用户的openid
 */
API.prototype.getUser = function (openid, callback) {
  // https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID
  var url = this.prefix + 'user/info?openid=' + openid + '&access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取关注者列表
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=%E8%8E%B7%E5%8F%96%E5%85%B3%E6%B3%A8%E8%80%85%E5%88%97%E8%A1%A8
 * @param {String} nextOpenid 调用一次之后，传递回来的nextOpenid。第一次获取时可不填
 */
API.prototype.getFollowers = function (nextOpenid, callback) {
  // https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID
  if (typeof nextOpenid === 'function') {
    callback = nextOpenid;
    nextOpenid = '';
  }
  var url = this.prefix + 'user/info?next_openid=' + nextOpenid + '&access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

// 客服消息
// http请求方式: POST https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN
/**
 * 发送文字消息
 * @param {String} openid 用户的openid
 * @param {String} text 发送的消息内容
 */
API.prototype.sendText = function (openid, text, callback) {
  // {
  //   "touser":"OPENID",
  //   "msgtype":"text",
  //   "text":
  //   {
  //        "content":"Hello World"
  //   }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
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
 * 发送图片消息
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID
 */
API.prototype.sendImage = function (openid, mediaId, callback) {
  // {
  //     "touser":"OPENID",
  //     "msgtype":"image",
  //     "image":
  //     {
  //       "media_id":"MEDIA_ID"
  //     }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
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
 * 发送视频消息
 * @param {String} openid 用户的openid
 * @param {String} mediaId 媒体文件的ID
 * @param {String} thumbMediaId 缩略图文件的ID
 */
API.prototype.sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  // {
  //     "touser":"OPENID",
  //     "msgtype":"video",
  //     "image":
  //     {
  //       "media_id":"MEDIA_ID"
  //       "thumb_media_id":"THUMB_MEDIA_ID"
  //     }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
  var data = {
    "touser": openid,
    "msgtype":"video",
    "image": {
      "media_id": mediaId,
      "thumb_media_id": thumbMediaId
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 发送音乐消息
 * @param {String} openid 用户的openid
 * @param {Object} music 音乐文件
 */
API.prototype.sendMusic = function (openid, music, callback) {
  // {
  //     "touser":"OPENID",
  //     "msgtype":"music",
  //     "music":
  //     {
  //       "title":"MUSIC_TITLE", // 可选
  //       "description":"MUSIC_DESCRIPTION", // 可选
  //       "musicurl":"MUSIC_URL",
  //       "hqmusicurl":"HQ_MUSIC_URL",
  //       "thumb_media_id":"THUMB_MEDIA_ID" 
  //     }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
  var data = {
    "touser": openid,
    "msgtype":"music",
    "music": music
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 发送图文消息
 * @param {String} openid 用户的openid
 * @param {Array} articles 图文列表
 */
API.prototype.sendNews = function (openid, articles, callback) {
  // {
  //     "touser":"OPENID",
  //     "msgtype":"news",
  //     "news":{
  //         "articles": [
  //          {
  //              "title":"Happy Day",
  //              "description":"Is Really A Happy Day",
  //              "url":"URL",
  //              "picurl":"PIC_URL"
  //          },
  //          {
  //              "title":"Happy Day",
  //              "description":"Is Really A Happy Day",
  //              "url":"URL",
  //              "picurl":"PIC_URL"
  //          }
  //          ]
  //     }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
  var data = {
    "touser": openid,
    "msgtype":"news",
    "news": {
      "articles": articles
    }
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

module.exports = API;
