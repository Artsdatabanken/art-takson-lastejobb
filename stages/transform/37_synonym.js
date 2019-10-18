const { io, log } = require("lastejobb");

const taxons = io.lesDatafil("map2");

const r = {};
const redirect = [];
const stats = {};
Object.keys(taxons).forEach(kode => {
  let taxon = taxons[kode];
  stats[taxon.status || "gyldig"] = (stats[taxon.status || "gyldig"] || 0) + 1;
  if (!taxon.status) {
    r[kode] = taxon; // Gyldig
    return;
  }

  const gyldig = taxons[taxon.kodeGyldig];
  if (!gyldig)
    return log.warn(
      `Finner ikke gyldig taxon ${taxon.kodeGyldig} fra ${kode} (${taxon.tittel.sn})`
    );

  fyllPåSynonymer(taxon.tittel, gyldig);
  redirect.push({ fra: kode, synonym: taxon.tittel.sn, til: taxon.kodeGyldig });
});

function fyllPåSynonymer(tittel, gyldig) {
  gyldig.synonym = {};
  Object.keys(tittel).forEach(lang => {
    if (lang == "url") return; // we don't url for the synonym?
    const navn = tittel[lang];
    if (gyldig.tittel[lang] === navn) return;
    gyldig.synonym[lang] = gyldig.synonym[lang] || [];
    gyldig.synonym[lang].push(navn);
  });
}

io.skrivDatafil(__filename, r);
io.skrivBuildfil("redirect", redirect);

log.info("Statistikk:");
Object.keys(stats).forEach(status =>
  log.info("   " + status + ": " + stats[status])
);
