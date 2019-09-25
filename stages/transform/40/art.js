const { io } = require("lastejobb");

const prefix = "AR";

const taxons = io.lesDatafil("map").items;

let taxon2Data = {};
taxons.forEach(tx => (taxon2Data[tx.id] = tx));

Object.keys(taxon2Data).forEach(kode => {
  let node = taxon2Data[kode];
  // Underarter flagges med finnes i Norge, mens "forelder" ikke finnes i Norge.
  // if (!node.finnesINorge) return
  while (node) {
    node.finnesINorge = true;
    node = taxon2Data[node.parentId];
  }
});

let child2parent = {};
taxons.forEach(taxon => {
  child2parent[taxon.id] = taxon.parentId;
});

function forelder(parentId) {
  if (!parentId) return {};
  let parent = taxon2Data[parentId];
  if (!parent) return null; // finnes ikke i Norge?
  while (parent.gyldigId !== parent.id) parent = taxon2Data[parent.gyldigId];
  if (!parent) return null;
  if (!parent.status === "Gyldig") return null;
  return parent;
}

function tilKode(id) {
  if (!id) return prefix;
  return prefix + "-" + id;
}

let koder = {};
taxons.forEach(c => {
  if (c.status !== "Gyldig") return;
  if (!c.finnesINorge) return;
  const kode = tilKode(c.id);
  const parent = forelder(c.parentId);
  if (!parent) return; // Kan være status Uavklart f.eks.
  const e = {
    tittel: c.tittel,
    nivå: c.nivå,
    foreldre: [tilKode(parent.id)]
  };
  koder[kode] = e;
});

io.skrivBuildfil(__filename, koder);
