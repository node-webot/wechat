/**
 * Session构造函数，用于与Connect的Session中间件集成的会话脚本
 * @param {String} id Session ID
 * @param {Object} req Connect中的请求对象
 * @param {Object} data 可选的其余数据，将被合并进Session对象中
 */
var Session = function (id, req, data) {
  Object.defineProperty(this, 'id', { value: id });
  Object.defineProperty(this, 'req', { value: req });
  if (data) {
    for (var key in data) {
      this[key] = data[key];
    }
  }
};

/**
 * 保存Session对象到实际的存储中
 *
 * Callback:
 *
 * - `err`, 错误对象，保存发生错误时传入
 * @param {Function} callback 保存Session的回调函数
 */
Session.prototype.save = function (callback) {
  this.req.sessionStore.set(this.id, this, callback || function(){});
  return this;
};

/**
 * 销毁Session对象
 *
 * Callback:
 *
 * - `err`, 错误对象，删除发生错误时传入
 * @param {Function} callback 从存储中删除Session数据后的回调函数
 */
Session.prototype.destroy = function (callback) {
  delete this.req.wxsession;
  this.req.sessionStore.destroy(this.id, callback);
  return this;
};

module.exports = Session;
