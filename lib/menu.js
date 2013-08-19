var Menu = function () {
  this.buttons = [];
};

Menu.prototype.addButton = function (button, subButtons) {
  if (subButtons) {
    delete button.type;
    delete button.key;
    button.sub_button = subButtons;
  }
  this.buttons.push(button);
  return this;
};

Menu.prototype.toString = function () {
  return JSON.stringify({"button": this.buttons});
};
exports.Menu = Menu;
