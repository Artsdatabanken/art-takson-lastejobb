const { io, json, url } = require("lastejobb");

let tre = io.lesDatafil("map2");
const toplevel = io.lesDatafil("art-takson-ubehandlet/type");
toplevel.forEach(node => {
  const kode = node.kode;
  if (tre[kode]) throw new Error("Duplikat: " + kode);
  tre[kode] = node;
});
new url(tre).assignUrls();
io.skrivBuildfil(__filename, json.objectToArray(tre));
