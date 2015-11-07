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
};


var serializer = null;
var deserializer = null;
var DEFAULT_INVALID_LIST_TIPS = "列表已过期，请重新获取列表";
var invalidListTips = DEFAULT_INVALID_LIST_TIPS;
var dynamic = false;


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
 * @param {String} head 回复开头
 * @param {String} delimiter 回复分隔符
 * @param {String} foot 回复底部
 */
List.add = function (name, items, head, delimiter, foot, done) {
  if(typeof head === "function") {
    done = head
  }
  if(typeof head === "object") {
    var opts = head;
    done = delimiter;
    head = opts.head;
    delimiter =  opts.delimiter;
    foot = opts.foot;
  }
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


  if (delimiter) {
    var lists = description.join('\n' + delimiter + '\n');
    list.description = util.format('%s\n%s\n%s', head || '', lists, (foot || ''));
  } else {
    list.description = description.join('\n');
  }

  if(dynamic) {
    list.createdAt = new Date().getTime();
    var serializedList =  serialize.serialize(list);
    serializer(list.name, serializedList, done);
  } else {
    listCache[name] = list;
  }
};

/**
 * 设置序列化方法，保存动态List
 * @param  {Function} fn 序列化方法
 */
List.serializeList = function(fn) {
  serializer = fn;
  if(serializer && deserializer) {
    dynamic = true;
  }
}
/**
 * 设置反序列化方法，获取动态List
 * @param  {Function} fn 反序列化方法
 * @return {void}
 */
List.deserializeList = function(fn) {
  deserializer = fn;
  if(serializer && deserializer) {
    dynamic = true;
  }
}

/**
 * 静态方法，判断当前List是不是动态
 * @return {Boolean}
 */
List.isDynamic = function() {
  return dynamic;
}

/**
 * 静态方法，获取列表过期提示
 * @return {string} 当前列表过期提示内容
 */
List.getInvalidListTips  = function() {
  return invalidListTips;
}

/**
 * 静态方法，设置列表过期提示
 * @param {string} tips 列表过期提示内容
 */
List.setInvalidListTips = function(tips) {
  invalidListTips = tips;
}
/**
 * 静态方法，重置List
 */
List.reset = function() {
  serializer = null;
  deserializer = null;
  dynamic = false;
  invalidListTips = DEFAULT_INVALID_LIST_TIPS;
}

/**
 * 静态方法，从缓存中根据名字取出List对象
 * @param {String} name 列表名字
 */
List.get = function (name, done) {
  if(dynamic) {
    deserializer(name, function(err,serializedList){
      if(err) return done(err);
      var list = serialize.unserialize(serializedList);
      var originList = new List();
      originList.map = list.map;
      originList.name = list.name;
      originList.description = list.description;
      originList.createdAt = list.createdAt;
      done(null, originList);
    });
  } else {
    //still return the list immediately when use static
    return listCache[name];
  }
};

/**
 * 静态方法，清空缓存的所有的List对象
 * @param {String} name 列表名字
 */
List.clear = function () {
  listCache = {};
};

module.exports = List;
