const { io } = require("lastejobb");

const prefix = "AR";

const taxons = io.lesTempJson("30_map");

let taxon2Data = {};
taxons.forEach(tx => (taxon2Data[tx.id] = tx));

let child2parent = {};
taxons.forEach(taxon => {
  child2parent[taxon.id] = taxon.parentId;
});

function forelder(parentId) {
  if (!parentId) return null;
  let parent = taxon2Data[parentId];
  if (!parent) return null; // finnes ikke i Norge?
  while (parent.gyldigId !== parent.id) {
    parent = taxon2Data[parent.gyldigId];
    if (!parent) return null;
  }
  return parent;
}

function tilKode(id) {
  if (!id) return prefix;
  return prefix + "-" + id;
}

let koder = {};
const synonym = {};

taxons.forEach(c => {
  switch (c.status) {
    case "Uavklart":
      return;
    case "Synonym":
      c.kodeGyldig = tilKode(c.gyldigId);
      synonym[tilKode(c.id)] = c;
      return;
  }

  const kode = tilKode(c.id);
  const parent = forelder(c.parentId);
  const e = {
    tittel: c.tittel,
    nivå: c.nivå,
    kodeautor: c.gyldigId,
    autoritet: c.autoritet,
    finnesINorge: c.finnesINorge,
    foreldre: [tilKode(parent && parent.id)]
  };

  if (koder[kode]) debugger;
  koder[kode] = e;
});

io.skrivDatafil(__filename, koder);
io.skrivDatafil("35_synonym", synonym);
