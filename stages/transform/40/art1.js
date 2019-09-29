const { io, json, url } = require("lastejobb");

let tre = json.arrayToObject(io.lesDatafil("map").items, {
  uniqueKey: "id",
  removeKeyProperty: false
});

new url(tre).assignUrls();
io.skrivDatafil(__filename, tre);
