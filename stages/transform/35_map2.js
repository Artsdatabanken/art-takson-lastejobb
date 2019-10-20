const { io, log } = require("lastejobb");

const prefix = "AR";

const taxons = io.lesDatafil("30_map").items;

let taxon2Data = {};
taxons.forEach(tx => (taxon2Data[tx.id] = tx));
//tvingOverordnetTilÅFinnesINorge();

function tvingOverordnetTilÅFinnesINorge() {
  Object.keys(taxon2Data).forEach(id => {
    let node = taxon2Data[id];
    // Underarter flagges med finnes i Norge, mens "forelder" ikke finnes i Norge.
    if (!node.finnesINorge) return;
    while (true) {
      //      debugger;
      if (node.id === "48103") debugger;
      node = forelder(node.parentId);
      if (!node) break;
      if (!node.finnesINorge && node.nivå === "Art") {
        // https://github.com/Artsdatabanken/Artsnavnebase/issues/3
        log.warn(
          "Finnes ikke i Norge, men har barn som finnes i Norge: " + node.id
        );
        node.finnesINorge = true;
      }
    }
  });
}

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
  //  if (!c.finnesINorge) return;
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
