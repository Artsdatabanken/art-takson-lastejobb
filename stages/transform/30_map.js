const { io } = require("lastejobb");

const alleår = {};

const hierarki = io
  .readJson("temp/art-takson-ubehandlet/hierarki.json")
  .items.reverse();

const taxon = io.lesTempJson("20_taxon_to_json");

const r = [];
taxon.forEach(e => transform(e));
io.skrivDatafil("alleår", alleår);
io.skrivDatafil(__filename, r);

function transform(record) {
  const o = {
    id: record.PK_LatinskNavnID,
    parentId: record.FK_OverordnaLatinskNavnID,
    taxonId: record.PK_TaksonID,
    tittel: {
      sn: capitalizeFirstLetter(settSammenNavn(record))
    },
    nivå: nivå(record),
    status: record.Hovedstatus,
    gyldigId: record.FK_GyldigLatinskNavnID,
    autoritet: decodeAutorStreng(record.Autorstreng),
    finnesINorge: record.FinnesINorge === "Ja"
  };

  o.tittel.url = capitalizeFirstLetter(record[o.nivå]);

  pop(o.tittel, "nb", record, "Bokmål");
  pop(o.tittel, "nn", record, "Nynorsk");
  pop(o.tittel, "sa", record, "Samisk");
  r.push(o);
}

function decodeAutorStreng(autorstreng) {
  if (autorstreng.length <= 0) return {};
  const r = autorstreng.match(/\(?(.*?)[\s\,\(]+([\d][\d][\d][\d])/);
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
    const nivå = hierarki[i].tittel;
    if (r[nivå]) return nivå;
  }
  throw new Error("Mangler nivå på art med sciId #" + r.PK_LatinskNavnID);
}

function settSammenNavn(r) {
  let navn = "";
  for (i = 0; i < hierarki.length; i++) {
    var erKomplett = false;
    const rank = hierarki[i];
    const nivå = rank.tittel;
    if (navn && nivå === "Underslekt") continue; // Underslekt blir ikke med i artsnavnet (bare slekt)?
    if (navn && nivå === "Seksjon") continue; // Seksjon blir ikke med i artsnavnet
    if (!r[nivå]) continue;
    const pre = rank.prefiks ? rank.prefiks + " " : "";
    navn = pre + r[nivå] + " " + navn;
    if (i >= 4 && navn) erKomplett = true;
    if (erKomplett) return navn.trim();
  }
  throw new Error("Mangler navn på art med sciId #" + r.PK_LatinskNavnID);
}
