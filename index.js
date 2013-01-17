module.exports = process.env.WEIXIN_COV ? require('./lib-cov/wechat') : require('./lib/wechat');
