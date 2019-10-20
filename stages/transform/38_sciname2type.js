const { io, json } = require("lastejobb");

const taxon = io.lesDatafil("37_synonym");

const sciName2ValidSciNameId = {};
Object.keys(taxon).forEach(kode => tittel(kode, taxon[kode].tittel.sn));
Object.keys(taxon).forEach(kode => synonym(kode));

const r = json.objectToArray(sciName2ValidSciNameId, "sn");
io.skrivBuildfil("sciName2ValidSciNameId", r);

function tittel(kode, tittel) {
  tittel = tittel.toLowerCase();
  if (!sciName2ValidSciNameId[tittel])
    sciName2ValidSciNameId[tittel] = { koder: [] };
  sciName2ValidSciNameId[tittel].koder.push(kode);
}

function synonym(kode) {
  const o = taxon[kode];
  if (!o.synonym) return;
  if (!o.synonym.sn) return;
  o.synonym.sn.forEach(syn => tittel(kode, syn));
}
