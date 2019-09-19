const { io } = require("lastejobb");

const toplevel = io.lesDatafil("art-kode-ubehandlet/type");
io.skrivBuildfil(__filename, toplevel);
