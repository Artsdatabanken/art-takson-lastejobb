const { io, log } = require("lastejobb");

const taxons = io.lesDatafil("35_map2");
const synonyms = io.lesDatafil("35_synonym");

const redirect = [];
const stats = {};
Object.keys(synonyms).forEach(kode => {
  let synonym = synonyms[kode];
  const gyldig = taxons[synonym.kodeGyldig];
  if (!gyldig)
    return log.warn(
      `Finner ikke gyldig taxon ${synonym.kodeGyldig} fra ${kode} (${synonym.tittel.sn})`
    );

  fyllPåSynonymer(synonym.tittel, gyldig);
  redirect.push({
    fra: kode,
    synonym: synonym.tittel.sn,
    til: synonym.kodeGyldig
  });
});

function fyllPåSynonymer(tittel, gyldig) {
  if (!gyldig.synonym) gyldig.synonym = {};
  Object.keys(tittel).forEach(lang => {
    if (lang == "url") return; // we don't url for the synonym?
    const navn = tittel[lang];
    if (gyldig.tittel[lang] === navn) return;
    gyldig.synonym[lang] = gyldig.synonym[lang] || [];
    gyldig.synonym[lang].push(navn);
  });
}

io.skrivDatafil(__filename, taxons);
io.skrivBuildfil("redirect", redirect);

log.info("Statistikk:");
Object.keys(stats).forEach(status =>
  log.info("   " + status + ": " + stats[status])
);
