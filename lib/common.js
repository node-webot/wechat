var path = require('path');
var fs = require('fs');
var urllib = require('urllib');
var formstream = require('formstream');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 根据appid和appsecret创建API的构造函数
 *
 * Examples:
 * ```
 * var API = require('wechat').API;
 * var api = new API('appid', 'secret');
 * ```
 * @param {String} appid 在公众平台上申请得到的appid
 * @param {String} appsecret 在公众平台上申请得到的app secret
 */
var API = function (appid, appsecret) {
  this.appid = appid;
  this.appsecret = appsecret;
  this.prefix = 'https://api.weixin.qq.com/cgi-bin/';
  this.mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
  this.fileServerPrefix = 'http://file.api.weixin.qq.com/cgi-bin/';
};

/**
 * 根据创建API时传入的appid和appsecret获取access token
 * 进行后续所有API调用时，需要先获取access token
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token>
 *
 * Examples:
 * ```
 * api.getAccessToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
 * ```
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
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    that.expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
    callback(err, data);
  }));
  return this;
};

/**
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * api.isAccessTokenValid();
 * ```
 */
API.prototype.isAccessTokenValid = function () {
  return !!this.token && (new Date().getTime()) < this.expireTime;
};

/**
 * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用
 * 无需依赖getAccessToken为前置调用
 *
 * @param {Function} method 需要封装的方法
 * @param {Array} args 方法需要的参数
 */
API.prototype.preRequest = function (method, args) {
  var that = this;
  var callback = args[args.length - 1];
  if (that.isAccessTokenValid()) {
    method.apply(that, args);
  } else {
    that.getAccessToken(function (err, data) {
      // 如遇错误，通过回调函数传出
      if (err) {
        callback(err, data);
        return;
      }
      method.apply(that, args);
    });
  }
};

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
API.prototype.createMenu = function (menu, callback) {
  this.preRequest(this._createMenu, arguments);
};

/*!
 * 创建自定义菜单的未封装版本
 */
API.prototype._createMenu = function (menu, callback) {
  var url = this.prefix + 'menu/create?access_token=' + this.token;
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
API.prototype.getMenu = function (callback) {
  this.preRequest(this._getMenu, arguments);
};

/*!
 * 获取自定义菜单的未封装版本
 */
API.prototype._getMenu = function (callback) {
  var url = this.prefix + 'menu/get?access_token=' + this.token;
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
API.prototype.removeMenu = function (callback) {
  this.preRequest(this._removeMenu, arguments);
};

/*!
 * 删除自定义菜单的未封装版本
 */
API.prototype._removeMenu = function (callback) {
  var url = this.prefix + 'menu/delete?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取二维码
 * @param {Object} data 二维码数据
 * @param {Function} callback 回调函数
 */
API.prototype.getQRCode = function (data, callback) {
  this.preRequest(this._getQRCode, arguments);
};

/*!
 * 获取二维码的未封装版本
 */
API.prototype._getQRCode = function (data, callback) {
  var url = this.prefix + 'qrcode/get?access_token=' + this.token;
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 创建临时二维码
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码>
 * Examples:
 * ```
 * api.createTmpQRCode(10000, 1800, callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA==",
 *  "expire_seconds":1800
 * }
 * ```
 * @param {Number} sceneId 场景ID
 * @param {Number} expire 过期时间，单位秒。最大不超过1800
 * @param {Function} callback 回调函数
 */
API.prototype.createTmpQRCode = function (sceneId, expire, callback) {
  this.preRequest(this._createTmpQRCode, arguments);
};

/*!
 * 创建临时二维码的未封装版本
 */
API.prototype._createTmpQRCode = function (sceneId, expire, callback) {
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
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码>
 * Examples:
 * ```
 * api.createLimitQRCode(100, callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA=="
 * }
 * ```
 * @param {Number} sceneId 场景ID。ID不能大于100000
 * @param {Function} callback 回调函数
 */
API.prototype.createLimitQRCode = function (sceneId, callback) {
  this.preRequest(this._createLimitQRCode, arguments);
};

/*!
 * 创建永久二维码的未封装版本
 */
API.prototype._createLimitQRCode = function (sceneId, callback) {
  var url = this.prefix + 'qrcode/create?access_token=' + this.token;
  var data = {
    "action_name": "QR_LIMIT_SCENE",
    "action_info": {"scene": {"scene_id": sceneId}}
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 生成显示二维码的链接。微信扫描后，可立即进入场景
 * Examples:
 * ```
 * api.showQRCodeURL(titck);
 * // => https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET
 * ```
 * @param {String} ticket 二维码Ticket
 * @return {String} 显示二维码的URL地址，通过img标签可以显示出来
 */
API.prototype.showQRCodeURL = function (ticket) {
  return this.mpPrefix + 'showqrcode?ticket=' + ticket;
};

/**
 * 获取分组列表
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.getGroups(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "groups": [
 *    {"id": 0, "name": "未分组", "count": 72596}, 
 *    {"id": 1, "name": "黑名单", "count": 36}
 *  ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
API.prototype.getGroups = function (callback) {
  this.preRequest(this._getGroups, arguments);
};

/*!
 * 获取分组列表的未封装版本
 */
API.prototype._getGroups = function (callback) {
  // https://api.weixin.qq.com/cgi-bin/groups/get?access_token=ACCESS_TOKEN
  var url = this.prefix + 'groups/get?access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 创建分组
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.createGroup('groupname', callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"group": {"id": 107, "name": "test"}}
 * ```
 * @param {String} name 分组名字
 * @param {Function} callback 回调函数
 */
API.prototype.createGroup = function (name, callback) {
  this.preRequest(this._createGroup, arguments);
};

/*!
 * 创建分组的未封装版本
 */
API.prototype._createGroup = function (name, callback) {
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
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.updateGroup(107, 'new groupname', callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {Number} id 分组ID
 * @param {String} name 新的分组名字
 * @param {Function} callback 回调函数
 */
API.prototype.updateGroup = function (id, name, callback) {
  this.preRequest(this._updateGroup, arguments);
};

/*!
 * 更新分组名字的未封装版本
 */
API.prototype._updateGroup = function (id, name, callback) {
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
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=分组管理接口>
 * Examples:
 * ```
 * api.moveUserToGroup(openid, groupId, callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {String} openid 用户的openid
 * @param {Number} groupId 分组ID
 * @param {Function} callback 回调函数
 */
API.prototype.moveUserToGroup = function (openid, groupId, callback) {
  this.preRequest(this._moveUserToGroup, arguments);
};

/*!
 * 移动用户进分组的未封装版本
 */
API.prototype._moveUserToGroup = function (openid, groupId, callback) {
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
 * 获取用户基本信息
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=获取用户基本信息>
 * Examples:
 * ```
 * api.getUser(openid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "subscribe": 1, 
 *  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M", 
 *  "nickname": "Band", 
 *  "sex": 1, 
 *  "language": "zh_CN", 
 *  "city": "广州", 
 *  "province": "广东", 
 *  "country": "中国", 
 *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0", 
 *  "subscribe_time": 1382694957
 * }
 * ```
 * @param {String} openid 用户的openid
 * @param {Function} callback 回调函数
 */
API.prototype.getUser = function (openid, callback) {
  this.preRequest(this._getUser, arguments);
};

/*!
 * 获取用户基本信息的未封装版本
 */
API.prototype._getUser = function (openid, callback) {
  // https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID
  var url = this.prefix + 'user/info?openid=' + openid + '&access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

/**
 * 获取关注者列表
 * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=获取关注者列表
 * Examples:
 * ```
 * api.getFollowers(callback);
 * // or
 * api.getFollowers(nextOpenid, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "total":2,
 *  "count":2,
 *  "data":{
 *    "openid":["","OPENID1","OPENID2"]
 *  },
 *  "next_openid":"NEXT_OPENID"
 * }
 * ```
 * @param {String} nextOpenid 调用一次之后，传递回来的nextOpenid。第一次获取时可不填
 * @param {Function} callback 回调函数
 */
API.prototype.getFollowers = function (nextOpenid, callback) {
  this.preRequest(this._getFollowers, arguments);
};

/*!
 * 获取关注者列表的未封装版本
 */
API.prototype._getFollowers = function (nextOpenid, callback) {
  // https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID
  if (typeof nextOpenid === 'function') {
    callback = nextOpenid;
    nextOpenid = '';
  }
  var url = this.prefix + 'user/get?next_openid=' + nextOpenid + '&access_token=' + this.token;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};

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
API.prototype.sendText = function (openid, text, callback) {
  this.preRequest(this._sendText, arguments);
};

/*!
 * 客服消息，发送文字消息的未封装版本
 */
API.prototype._sendText = function (openid, text, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"text",
  //  "text": {
  //    "content":"Hello World"
  //  }
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
API.prototype.sendImage = function (openid, mediaId, callback) {
  this.preRequest(this._sendImage, arguments);
};

/*!
 * 客服消息，发送图片消息的未封装版本
 */
API.prototype._sendImage = function (openid, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"image",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //  }
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
API.prototype.sendVoice = function (openid, mediaId, callback) {
  this.preRequest(this._sendVoice, arguments);
};

/*!
 * 客服消息，发送语音消息的未封装版本
 */
API.prototype._sendVoice = function (openid, mediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"image",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //  }
  // }
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
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
API.prototype.sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  this.preRequest(this._sendVideo, arguments);
};

/*!
 * 客服消息，发送视频消息的未封装版本
 */
API.prototype._sendVideo = function (openid, mediaId, thumbMediaId, callback) {
  // {
  //  "touser":"OPENID",
  //  "msgtype":"video",
  //  "image": {
  //    "media_id":"MEDIA_ID"
  //    "thumb_media_id":"THUMB_MEDIA_ID"
  //  }
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
API.prototype.sendMusic = function (openid, music, callback) {
  this.preRequest(this._sendMusic, arguments);
};

/*!
 * 客服消息，发送音乐消息的未封装版本
 */
API.prototype._sendMusic = function (openid, music, callback) {
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
  var url = this.prefix + 'message/custom/send?access_token=' + this.token;
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
API.prototype.sendNews = function (openid, articles, callback) {
  this.preRequest(this._sendNews, arguments);
};

/*!
 * 客服消息，发送图文消息的未封装版本
 */
API.prototype._sendNews = function (openid, articles, callback) {
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

/**
 * 上传多媒体文件，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=上传下载多媒体文件>
 * Examples:
 * ```
 * api.uploadMedia('filepath', type, callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
 * ```
 * Shortcut:
 *
 * - `API.prototype.uploadImage(filepath, callback);`
 * - `API.prototype.uploadVoice(filepath, callback);`
 * - `API.prototype.uploadVideo(filepath, callback);`
 * - `API.prototype.uploadThumb(filepath, callback);`
 *
 * @param {String} filepath 文件路径
 * @param {String} type 媒体类型，可用值有image、voice、video、thumb
 * @param {Function} callback 回调函数
 */
API.prototype.uploadMedia = function (filepath, type, callback) {
  this.preRequest(this._uploadMedia, arguments);
};

/*!
 * 上传多媒体文件的未封装版本
 */
API.prototype._uploadMedia = function (filepath, type, callback) {
  var that = this;
  fs.stat(filepath, function (err, stat) {
    if (err) {
      return callback(err);
    }
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var url = that.fileServerPrefix + 'media/upload?access_token=' + that.token + '&type=' + type;
    var opts = {
      dataType: 'json',
      type: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      stream: form
    };
    urllib.request(url, opts, wrapper(callback));
  });
};

['image', 'voice', 'video', 'thumb'].forEach(function (type) {
  var method = 'upload' + type[0].toUpperCase() + type.substring(1);
  API.prototype[method] = function (filepath, callback) {
    this.uploadMedia(filepath, type, callback);
  };
});

/**
 * 根据媒体ID获取媒体内容
 * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=上传下载多媒体文件>
 * Examples:
 * ```
 * api.getMedia('media_id', callback);
 * ```
 * Callback:
 * 
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 *
 * @param {String} mediaId 媒体文件的ID
 * @param {Function} callback 回调函数
 */
API.prototype.getMedia = function (mediaId, callback) {
  this.preRequest(this._getMedia, arguments);
};

/*!
 * 上传多媒体文件的未封装版本
 */
API.prototype._getMedia = function (mediaId, callback) {
  var url = this.fileServerPrefix + 'media/get?access_token=' + this.token + '&media_id=' + mediaId;
  urllib.request(url, {}, wrapper(function (err, data, res) {
    // 不用处理err，因为wrapper函数处理过
    var contentType = res.headers['content-type'];
    if (contentType === 'application/json') {
      var ret;
      try {
        ret = JSON.parse(data);
        if (ret.errcode) {
          err = new Error(ret.errmsg);
          err.name = 'WeChatAPIError';
        }
      } catch (ex) {
        callback(ex, data, res);
        return;
      }
      callback(err, ret, res);
    } else {
      // 输出Buffer对象
      callback(null, data, res);
    }
  }));
};

module.exports = API;
