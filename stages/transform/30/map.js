const { io } = require("lastejobb");

const hierarki = io
  .readJson("data/art-takson-ubehandlet/hierarki.json")
  .reverse();

const taxon = io.lesDatafil("taxon_to_json");

const r = [];
taxon.items.forEach(e => transform(e));
io.skrivDatafil(__filename, r);

function transform(record) {
  // TODO: Fjern varietet og form inntil videre
  //  if (r["Underart"]) return
  if (record["Varietet"]) return;
  if (record["Form"]) return;

  const o = {
    id: record.PK_LatinskNavnID,
    parentId: record.FK_OverordnaLatinskNavnID,
    taxonId: record.PK_TaksonID,
    tittel: { sn: capitalizeFirstLetter(settSammenNavn(record)) },
    nivå: nivå(record),
    status: record.Hovedstatus,
    gyldigId: record.FK_GyldigLatinskNavnID,
    finnesINorge: record.FinnesINorge === "Ja"
  };

  pop(o.tittel, "nb", record, "Bokmål");
  pop(o.tittel, "nn", record, "Nynorsk");
  pop(o.tittel, "sa", record, "Samisk");
  r.push(o);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pop(o, key, r, suffix) {
  const value = r["Populærnavn" + suffix];
  if (!value) return;
  o[key] = capitalizeFirstLetter(value);
}

function nivå(r) {
  for (i = 0; i < hierarki.length; i++) {
    const nivå = hierarki[i];
    if (r[nivå]) return nivå;
  }
  throw new Error("Mangler nivå på art med sciId #" + r.PK_LatinskNavnID);
}

function settSammenNavn(r) {
  for (i = 0; i < hierarki.length; i++) {
    const nivå = hierarki[i];
    if (r[nivå]) return r[nivå];
  }
  throw new Error("Mangler navn på art med sciId #" + r.PK_LatinskNavnID);
}
