var Event = function () {
  this.events = {};
};

Event.prototype.add = function (event, callback) {
  this.events[event] = callback;
  return this;
};

Event.prototype._dispatch = function (message, req, res, next) {
  if (this.events[message.Event]) {
    this.events[message.Event](message, req, res, next);
  } else {
    next();
  }
};

/**
 * 分发消息
 * ```
 * var Event = require('wechat').Event;
 * var events = new Event();
 * events.add('pic_weixin', function (message, req, res, next) {
 *   // 弹出微信相册发图器的事件推送
 * });
 * var handle = Event.dispatch(events);
 * app.use('/wechat', wechat(config).event(handle).middlewarify());
 * ```
 */
Event.dispatch = function (event) {
  return function (message, req, res, next) {
    // message为事件内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'event',
    // Event: 'LOCATION',
    // Latitude: '23.137466',
    // Longitude: '113.352425',
    // Precision: '119.385040',
    // MsgId: '5837397520665436492' }
    event._dispatch(message, req, res, next);
  };
};

module.exports = Event;
