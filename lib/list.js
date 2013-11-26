/*!
 * 缓存列表
 */
var listCache = {};

/**
 * 回复列表类型
 */
var List = function () {
  this.map = {};
};

/**
 * 从List对象中根据key取出对应的handler
 * @param {String} key 列表中的关键词
 */
List.prototype.get = function (key) {
  return this.map[key];
};

/**
 * 静态方法，根据items生成List对象，并放置到缓存中
 * @param {String} name 列表名字
 * @param {Array} items 元素列表
 */
List.add = function (name, items) {
  var description = [];
  var list = new List();
  list.name = name;
  items.forEach(function (item) {
    var text = item[0];
    // 抽取出key，并关联上对应的handle
    var replaced = text.replace(/\{(.*)\}/, function (match, key) {
      list.map[key] = item[1];
      return key;
    });
    description.push(replaced);
  });
  list.description = description.join('\n'),
  listCache[name] = list;
};

/**
 * 静态方法，从缓存中根据名字取出List对象
 * @param {String} name 列表名字
 */
List.get = function (name) {
  return listCache[name];
};

/**
 * 静态方法，清空缓存的所有的List对象
 * @param {String} name 列表名字
 */
List.clear = function () {
  listCache = {};
};

module.exports = List;
