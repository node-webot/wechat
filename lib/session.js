var Session = function (id, req) {
  Object.defineProperty(this, 'id', { value: id });
  Object.defineProperty(this, 'req', { value: req });
};

Session.prototype.touch = function(){
  return this.resetMaxAge();
};

Session.prototype.resetMaxAge = function(){
  this.cookie.maxAge = this.cookie.originalMaxAge;
  return this;
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
