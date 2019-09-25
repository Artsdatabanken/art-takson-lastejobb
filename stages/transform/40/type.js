const { io } = require("lastejobb");

const toplevel = io.lesDatafil("art-takson-ubehandlet/type");
io.skrivBuildfil(__filename, toplevel);
