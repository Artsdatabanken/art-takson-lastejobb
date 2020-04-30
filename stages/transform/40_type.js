const { io, url } = require("lastejobb");

let tre = io.lesTempJson("38_finnesINorge");
const toplevel = io.lesTempJson("art-takson-ubehandlet/type");
toplevel.forEach(node => {
  const kode = node.kode;
  if (tre[kode]) throw new Error("Duplikat: " + kode);
  delete node.kode;
  tre[kode] = node;
});
new url(tre).assignUrls();
io.skrivBuildfil("type", tre);
