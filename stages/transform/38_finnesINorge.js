const { io } = require("lastejobb");

const taxons = io.lesTempJson("37_synonym");
const parent2Child = {};
const child2Parent = {};
const stats = {};

Object.keys(taxons).forEach(kode => {
  const taxon = taxons[kode];
  taxon.foreldre.forEach(forelderkode => {
    parent2Child[forelderkode] = [...(parent2Child[forelderkode] || []), kode];
    child2Parent[kode] = [...(child2Parent[kode] || []), forelderkode];
  });
});

Object.keys(taxons).forEach(kode => {
  if (taxons[kode].finnesINorge) underElementerFinnesOgsåINorge(kode);
});

Object.keys(taxons).forEach(kode => {
  if (taxons[kode].finnesINorge) overElementerFinnesOgsåINorge(kode);
});
io.skrivDatafil(__filename, taxons);
io.skrivDatafil("finnes_likevel_i_Norge_stats", stats);

// I en del tilfeller er finnesINorge bare satt på et høyere nivå, men da betyr det at
// også lavere nivå finnes i Norge
// https://github.com/Artsdatabanken/Artsnavnebase/issues/3
function underElementerFinnesOgsåINorge(kode, visited = {}) {
  if (visited[kode]) return
  visited[kode] = true
  const taxon = taxons[kode];

  if (!taxon.finnesINorge) {
    stats[taxon.nivå] = (stats[taxon.nivå] || 0) + 1;
    taxon.finnesINorge = true;
  }
  const children = parent2Child[kode] || [];
  children.forEach(kode => underElementerFinnesOgsåINorge(kode, visited));
}

function overElementerFinnesOgsåINorge(kode, visited = {}) {
  if (visited[kode]) return
  visited[kode] = true
  if (kode === "AR") return;
  const taxon = taxons[kode];
  const parents = child2Parent[kode] || [];
  if (!taxon.finnesINorge) {
    taxon.finnesINorge = true;
  }
  parents.forEach(kode => overElementerFinnesOgsåINorge(kode, visited));
}
