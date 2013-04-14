var listCache = {};

var List = function () {
  this.map = {};
};

List.prototype.get = function (key) {
  return this.map[key];
};

List.add = function (name, items) {
  var description = [];
  var list = new List();
  list.name = name;
  items.forEach(function (item) {
    var text = item[0];
    var replaced = text.replace(/\{(.*)\}/, function (match, key) {
      list.map[key] = item[1];
      return key;
    });
    description.push(replaced);
  });
  list.description = description.join('\n'),
  listCache[name] = list;
};

List.get = function (name) {
  return listCache[name];
};

List.clear = function () {
  listCache = {};
};

module.exports = List;
