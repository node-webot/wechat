module.exports = function(name) {
  if(!name || typeof name !== "string") return "";
  var formattedName = name.toLowerCase().split("");
  formattedName[0] = formattedName[0].toUpperCase();
  return formattedName.join("");
}