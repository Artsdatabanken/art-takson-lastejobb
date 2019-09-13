const { io } = require("lastejobb");

const hierarki = io.readJson("kildedata/hierarki.json");
io.skrivBuildfil(__filename, hierarki);
