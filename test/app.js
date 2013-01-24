var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat('some token', function (req, res, next) {
  var info = req.weixin;
  res.reply('hehe');
}));

module.exports = app;
