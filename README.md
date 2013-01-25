weixin [![Build Status](https://travis-ci.org/JacksonTian/weixin.png?branch=master)](https://travis-ci.org/JacksonTian/weixin)
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
  var message = req.weixin;
  // 回复屌丝(普通回复)
  if (message.FromUserName === 'diaosi') {
    res.reply('hehe');
  } else {
  // 回复高富帅(图文回复)
    res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }
}));
```

## Show cases
### Node.js API自动回复

![](http://nodeapi.cloudfoundry.com/qrcode.jpg)

欢迎关注。

代码：<https://github.com/JacksonTian/api-doc-service>

## 详细API
目前微信公共平台能接收到4种内容：文字、图片、位置、音频。其中音频还未正式开放。支持两种回复：纯文本和图文。  
针对目前的业务形态，发布了0.2.x版本，该版本支持四种内容分别处理，以保持业务逻辑的简洁性。

```
app.use('/wechat', wechat('some token', wechat.text(function (message, req, res, next) {
  // message为文本内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125035',
  // MsgType: 'text',
  // Content: 'http',
  // MsgId: '5837397576500011341' }
}).image(function (message, req, res, next) {
  // message为图片内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359124971',
  // MsgType: 'image',
  // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
  // MsgId: '5837397301622104395' }
}).location(function (message, req, res, next) {
  // message为位置内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125311',
  // MsgType: 'location',
  // Location_X: '30.283950',
  // Location_Y: '120.063139',
  // Scale: '15',
  // Label: {},
  // MsgId: '5837398761910985062' }
}).voice(function (message, req, res, next) {
  // message为音频内容
  // 微信官方还未正式开放音频内容，但是可以获取到部分信息，内容如下：
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'voice',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // Format: 'amr',
  // MsgId: '5837397520665436492' }
}));
```

注意： `text`, `image`, `location`, `voice`方法请至少指定一个。
这四个方法的设计适用于按内容类型区分处理的场景。如果需要更复杂的场景，请使用第一个例子中的API。
