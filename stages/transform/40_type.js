const { io, log, url } = require("lastejobb");

let tre = io.lesTempJson("38_finnesINorge");
const toplevel = io.lesTempJson("art-takson-ubehandlet/type");
toplevel.forEach(node => {
  const kode = node.kode;
  if (tre[kode]) throw new Error("Duplikat: " + kode);
  delete node.kode;
  tre[kode] = node;
});

Object.keys(tre).forEach(kode => {
  const node = tre[kode]
  if (kode === node.foreldre[0]) {
    // Noen ganger innimellom kan Artsnavnebasen tydeligvis inneholde feil
    // Fjern takson som er underart av seg selv 
    delete tre[kode]
    return log.warn('Mangler forelder: ' + kode + " " + JSON.stringify(node.tittel))
  }
  if (node.foreldre[0] === "AR-50747") delete tre[kode]
})

// Og fjern hele subtrærne av noder som over har blitt fjernet pga. feil
let removedSome = true
while (removedSome) {
  removedSome = false
  Object.keys(tre).forEach(kode => {
    const node = tre[kode]
    const forelderkode = node.foreldre[0]
    if (!forelderkode) return
    const forelder = tre[forelderkode]

    if (!forelder) {
      debugger
      log.warn('Mangler forelder: ' + kode + " " + JSON.stringify(node))
      delete tre[kode]
      removedSome = true
    }
  })
}

new url(tre).assignUrls();
io.skrivBuildfil("type", tre);
