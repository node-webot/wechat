var wechat = require('./lib/wechat');
// 等待回复
wechat.List = require('./lib/list');
// 事件
wechat.Event = require('./lib/events');

Object.defineProperty(wechat, "API", {
  get: function () {
    console.log('The API property deprecated, Use require("wechat-api") instead');
    return require('wechat-api');
  }
});

Object.defineProperty(wechat, "OAuth", {
  get: function () {
    console.log('The API property deprecated, Use require("wechat-oauth") instead');
    return require('wechat-oauth');
  }
});

module.exports = wechat;
