const { io } = require("lastejobb");

const alleår = {};

const hierarki = io
  .readJson("data/art-takson-ubehandlet/hierarki.json")
  .reverse();

const taxon = io.lesDatafil("taxon_to_json");

const r = [];
taxon.items.forEach(e => transform(e));
io.skrivDatafil("alleår", alleår);
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
    autor: decodeAutorStreng(record.Autorstreng, settSammenNavn(record)),
    finnesINorge: record.FinnesINorge === "Ja"
  };

  pop(o.tittel, "nb", record, "Bokmål");
  pop(o.tittel, "nn", record, "Nynorsk");
  pop(o.tittel, "sa", record, "Samisk");
  r.push(o);
}

function decodeAutorStreng(autorstreng, sp) {
  if (autorstreng.length <= 0) return {};
  const r = autorstreng.match(/(.*?)[\s\,\(]+([\d][\d][\d][\d])/);
  //  if (!r) console.log(autorstreng, sp);
  if (!r) return { navn: autorstreng };
  alleår[r[2]] = (alleår[r[2]] || 0) + 1;
  const år = parseInt(r[2]);
  if (år < 1000 || år > 2020) return { navn: autorstreng };
  return { navn: r[1], år };
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
