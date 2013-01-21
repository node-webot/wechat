weixin
======

微信公共平台消息接口服务中间件

## Installation

```
npm install wechat
```

## Use with Connect/Express

```
var wechat = require('wechat');

app.use(connect.query()); // Or app.use(express.query());
app.use('/wechat', wechat('some token', function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var info = req.weixin;
  res.reply({msgType: 'text', content: 'hehe'});
}));
```

## Show cases
### Node.js API自动回复

![](http://nodeapi.cloudfoundry.com/qrcode.jpg)

欢迎关注。

代码：<https://github.com/JacksonTian/api-doc-service>