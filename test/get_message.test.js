var rewire = require('rewire');
var wechat = rewire('../lib/wechat');
var Readable = require('stream').Readable;
var util = require('util');
var should = require('should');

function Counter(opt) {
  Readable.call(this, opt);
}
util.inherits(Counter, Readable);

Counter.prototype._read = function() {};

var getMessage = wechat.__get__('getMessage');

describe('getMessage', function () {
  it('should not error', function (done) {
    var stream = new Counter();
    getMessage(stream, function (err, xml) {
      should.not.exist(err);
      done();
    });
    stream.push(new Buffer('<xml>'));
    stream.push(new Buffer('</xml>'));
    stream.push(null);
  });

  it('should exist error', function (done) {
    var stream = new Counter();
    getMessage(stream, function (err, xml) {
      should.exist(err);
      done();
    });
    stream.emit('error', new Error('some error'));
  });
});
