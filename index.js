var wechat = require('./lib/wechat');
wechat.List = require('./lib/list');
var API = require('./lib/api_common');
// 菜单接口
API.mixin(require('./lib/api_menu'));
// 分组管理
API.mixin(require('./lib/api_group'));
// 用户信息
API.mixin(require('./lib/api_user'));
// 二维码
API.mixin(require('./lib/api_qrcode'));
// 媒体管理（上传、下载）
API.mixin(require('./lib/api_media'));
// 客服消息
API.mixin(require('./lib/api_customer'));
// 模板消息
API.mixin(require('./lib/api_template'));
// 获取客服聊天记录
API.mixin(require('./lib/api_custom_service'));
// 高级群发接口
API.mixin(require('./lib/api_mass_send'));
// 微信小店商品管理接口
API.mixin(require('./lib/api_shop_goods'));
// 微信小店库存管理接口
API.mixin(require('./lib/api_shop_stock'));
// 微信小店邮费模版管理接口
API.mixin(require('./lib/api_shop_express'));
// 微信小店分组管理接口
API.mixin(require('./lib/api_shop_group'));
// 微信小店货架管理接口
API.mixin(require('./lib/api_shop_shelf'));
// 微信小店订单管理接口
API.mixin(require('./lib/api_shop_order'));
// 微信小店功能管理接口
API.mixin(require('./lib/api_shop_common'));
// 支付接口
API.mixin(require('./lib/api_pay'));
// 用户维权系统接口
API.mixin(require('./lib/api_feedback'));

wechat.API = API;
wechat.OAuth = require('./lib/oauth');
wechat.util = require('./lib/util');
module.exports = wechat;
