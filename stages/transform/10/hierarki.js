const { io } = require("lastejobb");

const hierarki = io.lesDatafil("art-kode-ubehandlet/hierarki");
io.skrivBuildfil(__filename, hierarki);
