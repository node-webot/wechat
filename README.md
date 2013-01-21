weixin
======

微信公共平台消息接口服务中间件

## Use with Connect/Express

```
var wechat = require('wechat');

app.use(connect.query()); // Or app.use(express.query());
app.use('/wechat', wechat('some token', function (req, res, next) {
  var info = req.weixin;
  res.reply({msgType: 'text', content: 'hehe'});
}));
```

