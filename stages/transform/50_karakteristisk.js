const { io, log } = require("lastejobb");

const inn = io.lesTempJson("art-takson-ubehandlet/karakteristisk_art");
const takson = io.readJson("build/type.json").items;

const kode2Takson = takson.reduce((acc, e) => {
  acc[e.kode] = e;
  return acc;
}, {});

const sciName2Takson = takson.reduce((acc, e) => {
  acc[e.tittel.sn.toLowerCase()] = e;
  return acc;
}, {});

const r = {};

inn.arter.forEach(karakteristisk => {
  var kart = sciName2Takson[karakteristisk.toLowerCase()];
  if (!kart)
    return log.warn(
      "Finner ikke karakteristisk art i taksonomi: " + karakteristisk
    );
  var art = kart;
  while (art.foreldre.length > 0) {
    const forelder = art.foreldre[0];
    if (r[forelder]) return; // En mer karakteristisk art har allerede tatt plassen
    r[forelder] = kart.kode;
    art = kode2Takson[forelder];
  }
});

io.skrivBuildfil("karakteristisk_art", r);
