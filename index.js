var wechat = require('./lib/wechat');
// 等待回复
wechat.List = require('./lib/list');
// 事件
wechat.Event = require('./lib/events');

wechat.API = require('wechat-api');
wechat.OAuth = require('./lib/oauth');
wechat.util = require('./lib/util');
module.exports = wechat;
