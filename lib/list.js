var util = require('util');
var serialize = require('node-serialize');
/*!
 * 缓存列表
 */
var listCache = {};

/**
 * 回复列表类型
 */
var List = function () {
  this.map = {};
  this.values ={};
};

/**
 * 从List对象中根据key取出对应的handler
 * @param {String} key 列表中的关键词
 */
List.prototype.get = function (key) {
  return this.map[key];
};

/**
 * 从List对象中根据key取出对应的预设值
 * @param {String} key 列表中的关键词
 */
List.prototype.getValue = function (key) {
  return this.values[key];
};

/**
 * 静态方法，根据items生成List对象，并放置到缓存中
 * @param {String} name 列表名字
 * @param {Array} items 元素列表
 * @param {String} head 回复开头
 * @param {String} delimiter 回复分隔符
 * @param {String} foot 回复底部
 * * @param {HttpRequest} req 如果运行在多个nodejs节点的环境下，需要传递request参数
 */
List.add = function (name, items, head, delimiter, foot,req) {
  var description = [];
  var list = new List();
  list.name = name;
  items.forEach(function (item) {
    var text = item[0];
    // 抽取出key，并关联上对应的handle
    var replaced = text.replace(/\{(.*)\}/, function (match, key) {
      list.map[key] = item[1];
      if (item[2]) {
        list.values[key] = item[2];
      }
      return key;
    });
    description.push(replaced);
  });

  var formatDescription = null;
  if (delimiter) {
    formatDescription = description.join('\n' + delimiter + '\n');
  } else {
    formatDescription = description.join('\n');
  }
  list.description = util.format('%s\n%s\n%s', head || '', formatDescription, (foot || ''));

  if (delimiter) {
    var lists = description.join('\n' + delimiter + '\n');
    list.description = util.format('%s\n%s\n%s', head || '', lists, (foot || ''));
  } else if (head || foot) {
    list.description = util.format('%s\n%s\n%s', head || '', description.join('\n'), (foot || ''));;
  } else {
    list.description = description.join('\n');
  }


  if (req && req.wxsession) {
    req.wxsession._list = serialize.serialize(list);
  } else {
    listCache[name] = list;
  }

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

/**
 * 静态方法，unserialize List object from JSON string.
 * using serialize module here is to support serialize/unserailize methods also
 * @param {String} objString JSON string of List object
 */
List.unserialize = function (objString) {
  var list = new List();
  if(objString){
    var originObject = serialize.unserialize(objString);
    if(originObject){
      list.name = originObject.name;
      list.description = originObject.description;
      list.map = originObject.map;
      list.values=originObject.values;
    }
  }
  return list;
}

module.exports = List;
