const { io, log } = require("lastejobb");

const taxon = io.lesDatafil("37_synonym");

let sciName2ValidSciNameId = {};

Object.keys(taxon).forEach(kode => tittel(taxon[kode], taxon[kode].tittel.sn));
Object.keys(taxon).forEach(kode => synonym(taxon[kode]));

io.skrivDatafil(__filename, sciName2ValidSciNameId);

function tittel(o, tittel) {
  tittel = tittel.toLowerCase();
  if (sciName2ValidSciNameId[tittel]) {
    log.warn(
      o.kodeautor +
        "<->" +
        sciName2ValidSciNameId[tittel] +
        " har samme navn: " +
        tittel
    );
    sciName2ValidSciNameId[tittel].push(o.kodeautor);
  } else sciName2ValidSciNameId[tittel] = [o.kodeautor];
}

function synonym(o) {
  if (!o.synonym) return;
  if (!o.synonym.sn) return;
  o.synonym.sn.forEach(syn => tittel(o, syn));
}
