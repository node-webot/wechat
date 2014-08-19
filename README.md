wechat [![NPM version](https://badge.fury.io/js/wechat.png)](http://badge.fury.io/js/wechat) [![Build Status](https://travis-ci.org/node-webot/wechat.png?branch=master)](https://travis-ci.org/node-webot/wechat) [![Dependencies Status](https://david-dm.org/node-webot/wechat.png)](https://david-dm.org/node-webot/wechat) [![Coverage Status](https://coveralls.io/repos/node-webot/wechat/badge.png)](https://coveralls.io/r/node-webot/wechat)
======

微信公共平台消息接口服务中间件与API SDK

[Wechat document in English](./README.en.md)

## 功能列表
- 自动回复（文本、图片、语音、视频、音乐、图文）
- 发送客服消息（文本、图片、语音、视频、音乐、图文）
- 菜单操作（查询、创建、删除）
- 二维码（创建临时、永久二维码，查看二维码URL）
- 分组操作（查询、创建、修改、移动用户到分组）
- 用户信息（查询用户基本信息、获取关注者列表）
- 媒体文件（上传、获取）
- 等待回复（用于调查问卷、问答等场景）
- 会话支持（创新功能）
- OAuth API（授权、获取基本信息）
- 群发消息（文本、图片、语音、视频、图文）
- 客服记录
- 群发消息
- 公众号支付（发货通知、订单查询）
- 微信小店（商品管理、库存管理、邮费模板管理、分组管理、货架管理、订单管理、功能接口）
- 模版消息

详细参见[API文档](http://node-webot.github.io/wechat/api.html)

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
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    res.reply('hehe');
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    res.reply({
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3"
      }
    });
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
备注：token在[微信平台上申请](http://mp.weixin.qq.com/cgi-bin/callbackprofile?type=info&t=wxm-developer-ahead&lang=zh_CN)

### 回复消息
当用户发送消息到微信公众账号，自动回复一条消息。这条消息可以是文本、图片、语音、视频、音乐、图文。详见：[官方文档](http://mp.weixin.qq.com/wiki/index.php?title=发送被动响应消息)

#### 回复文本
```
res.reply('Hello world!');
// 或者
res.reply({type: "text", content: 'Hello world!'});
```
#### 回复图片
```
res.reply({
  type: "image",
  content: {
    mediaId: 'mediaId'
  }
});
```
#### 回复语音
```
res.reply({
  type: "voice",
  content: {
    mediaId: 'mediaId'
  }
});
```
#### 回复视频
```
res.reply({
  type: "video",
  content: {
    mediaId: 'mediaId',
    thumbMediaId: 'thumbMediaId'
  }
});
```
#### 回复音乐
```
res.reply({
  title: "来段音乐吧",
  description: "一无所有",
  musicUrl: "http://mp3.com/xx.mp3",
  hqMusicUrl: "http://mp3.com/xx.mp3"
});
```
#### 回复图文
```
res.reply([
  {
    title: '你来我家接我吧',
    description: '这是女神与高富帅之间的对话',
    picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
    url: 'http://nodeapi.cloudfoundry.com/'
  }
]);
```

### WXSession支持
由于公共平台应用的客户端实际上是微信，所以采用传统的Cookie来实现会话并不现实，为此中间件模块在openid的基础上添加了Session支持。一旦服务端启用了`connect.session`中间件，在业务中就可以访问`req.wxsession`属性。这个属性与`req.session`行为类似。

```
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use('/wechat', wechat('some token', wechat.text(function (info, req, res, next) {
  if (info.Content === '=') {
    var exp = req.wxsession.text.join('');
    req.wxsession.text = '';
    res.reply(exp);
  } else {
    req.wxsession.text = req.wxsession.text || [];
    req.wxsession.text.push(info.Content);
    res.reply('收到' + info.Content);
  }
})));
```

`req.wxsession`与`req.session`采用相同的存储引擎，这意味着如果采用redis作为存储，这样`wxsession`可以实现跨进程共享。

### 等待回复
等待回复，类似于电话拨号业务。该功能在WXSession的基础上提供。需要为等待回复预置操作，中间件将其抽象为`List`对象，在提供服务前需要添加服务。

```
var List = require('wechat').List;
List.add('view', [
  ['回复{a}查看我的性别', function (info, req, res) {
    res.reply('我是个妹纸哟');
  }],
  ['回复{b}查看我的年龄', function (info, req, res) {
    res.reply('我今年18岁');
  }],
  ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
]);
```

然后在业务中触发等待回复事务，如下示例，当收到用户发送`list`后，调用`res.wait('view')`进入事务`view`中。

```
var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use('/wechat', wechat('some token', wechat.text(function (info, req, res, next) {
  if (info.Content === 'list') {
    res.wait('view');
  } else {
    res.reply('hehe');
    // 或者中断等待回复事务
    // res.nowait('hehe');
  }
})));
```
用户将收到如下回复：

```
回复a查看我的性别
回复b查看我的年龄
回复c查看我的性取向
```

用户回复其中的`a`、`b`、`c`将会由注册的方法接管回复。回复可以是一个函数，也可以是一个字符串：

```
List.add('view', [
  ['回复{a}查看我的性别', function (info, req, res, next) {
    res.reply('我是个妹纸哟');
  }],
  // 或者字符串
  ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
]);
```

如果用户触发等待回复事务后，没有按照`{}`中的进行回复，那么将会由原有的默认函数进行处理。在原有函数中，可以选择调用`res.nowait()`中断事务。`nowait()`除了能中断事务外，与`reply`的行为一致。

## Show cases
### Node.js API自动回复

![Node.js API自动回复机器人](http://nodeapi.diveintonode.org/assets/qrcode.jpg)

欢迎关注。

代码：<https://github.com/JacksonTian/api-doc-service>

你可以在[CloudFoundry](http://www.cloudfoundry.com/)、[appfog](https://www.appfog.com/)、[BAE](http://developer.baidu.com/wiki/index.php?title=docs/cplat/rt/node.js)等搭建自己的机器人。

## 详细API
原始API文档请参见：[消息接口指南](http://mp.weixin.qq.com/wiki/index.php?title=消息接口指南)。

目前微信公共平台能接收到7种内容：文字、图片、音频、视频、位置、链接、事件。支持6种回复：纯文本、图文、音乐、音频、图片、视频。
针对目前的业务形态，发布了0.6.x版本，该版本支持六种内容分别处理，以保持业务逻辑的简洁性。

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
  // MediaId: 'media_id',
  // MsgId: '5837397301622104395' }
}).voice(function (message, req, res, next) {
  // message为音频内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'voice',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // Format: 'amr',
  // MsgId: '5837397520665436492' }
}).video(function (message, req, res, next) {
  // message为视频内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'video',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // ThumbMediaId: 'media_id',
  // MsgId: '5837397520665436492' }
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
}).link(function (message, req, res, next) {
  // message为链接内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'link',
  // Title: '公众平台官网链接',
  // Description: '公众平台官网链接',
  // Url: 'http://1024.com/',
  // MsgId: '5837397520665436492' }
}).event(function (message, req, res, next) {
  // message为事件内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'event',
  // Event: 'LOCATION',
  // Latitude: '23.137466',
  // Longitude: '113.352425',
  // Precision: '119.385040',
  // MsgId: '5837397520665436492' }
})));
```

注意： `text`, `image`, `voice`, `video`, `location`, `link`, `event`方法请至少指定一个。
这六个方法的设计适用于按内容类型区分处理的场景。如果需要更复杂的场景，请使用第一个例子中的API。

### 更简化的API设计
示例如下：

```
app.use('/wechat', wechat('some token').text(function (message, req, res, next) {
  // TODO
}).image(function (message, req, res, next) {
  // TODO
}).voice(function (message, req, res, next) {
  // TODO
}).video(function (message, req, res, next) {
  // TODO
}).location(function (message, req, res, next) {
  // TODO
}).link(function (message, req, res, next) {
  // TODO
}).event(function (message, req, res, next) {
  // TODO
}).middlewarify());
```
该接口从0.3.x提供。

### 流程图
![graph](https://raw.github.com/node-webot/wechat/master/figures/wechat.png)

诸多细节由wechat中间件提供，用户只要关注蓝色部分的业务逻辑即可。
## License
The MIT license.

## 交流群
QQ群：157964097，使用疑问，开发，贡献代码请加群。

## 感谢
感谢以下贡献者：

```

 project  : wechat
 repo age : 1 year, 6 months
 active   : 92 days
 commits  : 210
 files    : 58
 authors  :
   180  Jackson Tian            85.7%
    10  yelo                    4.8%
     4  Bruce Lee               1.9%
     4  realdog                 1.9%
     3  Guo Yu                  1.4%
     2  Lu Jun                  1.0%
     2  Jesse Yang              1.0%
     1  Rogerz Zhang            0.5%
     1  feichang.wyl            0.5%
     1  feit                    0.5%
     1  Chen Wei                0.5%
     1  Lance Li                0.5%

```

## 捐赠
如果您觉得Wechat对您有帮助，欢迎请作者一杯咖啡

![捐赠wechat](https://cloud.githubusercontent.com/assets/327019/2941591/2b9e5e58-d9a7-11e3-9e80-c25aba0a48a1.png)
