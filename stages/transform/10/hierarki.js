const { io } = require("lastejobb");

const hierarki = io.lesDatafil("art-takson-ubehandlet/hierarki");
io.skrivBuildfil(__filename, hierarki);
