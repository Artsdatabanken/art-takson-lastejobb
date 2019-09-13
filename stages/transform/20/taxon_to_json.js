var { csv, io } = require("lastejobb");

const kildefil = "data/inn_ar_taxon.csv";
const options = {
  delimiter: ";",
  relax_column_count: true,
  escape: "\\",
  encoding: "utf-8"
};
const json = csv.les(kildefil, options, { encoding: "latin1" }); // TODO: Why this file latin1 in 2019?
io.skrivDatafil(__filename, json);
