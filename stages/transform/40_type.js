const { io, url } = require("lastejobb");

let tre = io.lesDatafil("37_synonym");
const toplevel = io.lesDatafil("art-takson-ubehandlet/type");
toplevel.forEach(node => {
  const kode = node.kode;
  if (tre[kode]) throw new Error("Duplikat: " + kode);
  delete node.kode;
  tre[kode] = node;
});
new url(tre).assignUrls();
io.skrivBuildfil("type", tre);
