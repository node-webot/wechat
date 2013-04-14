var wechat = process.env.WEIXIN_COV ? require('./lib-cov/wechat') : require('./lib/wechat');
wechat.List = process.env.WEIXIN_COV ? require('./lib-cov/list') : require('./lib/list');
module.exports = wechat;
