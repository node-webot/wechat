require('should');
var Event = require('../').Event;

describe('events.js', function () {
  describe('event', function () {
    it('add event should ok', function () {
      var emitter = new Event();
      emitter.add('pic_weixin', function (message, req, res, next) {
        // 弹出微信相册发图器的事件推送
      });
      emitter.events.should.have.property('pic_weixin');
    });

    it('_dispatch should ok', function (done) {
      var emitter = new Event();
      var count = 0;
      emitter.add('pic_weixin', function (message, req, res, next) {
        // 弹出微信相册发图器的事件推送
        count++;
        next();
      });
      var message = {Event: 'pic_weixin'};
      emitter._dispatch(message, {}, {}, function () {
        count.should.have.be.equal(1);
        done();
      });
    });

    it('_dispatch miss should ok', function (done) {
      var emitter = new Event();
      var count = 0;
      var message = {Event: 'pic_weixin'};
      emitter.add('hehe', function (message, req, res, next) {
        count++;
        next();
      });
      emitter._dispatch(message, {}, {}, function () {
        count.should.have.be.equal(0);
        done();
      });
    });

    it('dispatch should ok', function (done) {
      var emitter = new Event();
      var count = 0;
      var message = {Event: 'pic_weixin'};
      emitter.add('pic_weixin', function (message, req, res, next) {
        count++;
        next();
      });
      var handle = Event.dispatch(emitter);
      handle(message, {}, {}, function () {
        count.should.have.be.equal(1);
        done();
      });
    });
  });
});
