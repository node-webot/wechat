var Session = function (id, req, data) {
  Object.defineProperty(this, 'id', { value: id });
  Object.defineProperty(this, 'req', { value: req });
  if (data) {
    for (var key in data) {
      this[key] = data[key];
    }
  }
};

Session.prototype.save = function(fn){
  this.req.sessionStore.set(this.id, this, fn || function(){});
  return this;
};

Session.prototype.destroy = function(fn){
  delete this.req.wxsession;
  this.req.sessionStore.destroy(this.id, fn);
  return this;
};

module.exports = Session;
