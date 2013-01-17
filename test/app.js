var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat.connect('some token', function (req, res, next) {
  var info = req.weixin;
  res.reply({msgType: 'text', content: 'hehe'});
}));

module.exports = app;
