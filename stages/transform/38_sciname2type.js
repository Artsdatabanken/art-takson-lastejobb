const { io, json } = require("lastejobb");

const taxon = io.lesDatafil("37_synonym");

const sciName2ValidSciNameId = []; //{ preferred: {}, synonym: {} };
Object.keys(taxon).forEach(kode =>
  tittel(kode, taxon[kode].tittel.sn, "preferred")
);
Object.keys(taxon).forEach(kode => synonym(kode));

io.skrivBuildfil("sciName2ValidSciNameId", sciName2ValidSciNameId);

function tittel(kode, tittel, nametype) {
  tittel = tittel.toLowerCase();
  sciName2ValidSciNameId.push({ tittel, kode, nametype });
}

function synonym(kode) {
  const o = taxon[kode];
  if (!o.synonym) return;
  if (!o.synonym.sn) return;
  o.synonym.sn.forEach(syn => tittel(kode, syn, "synonym"));
}
