const mongoose = require("mongoose");
const schema = mongoose.Schema;

const uniDataSchema = new schema({
  name: String,
  unis: Object
});

const uniData = mongoose.model("uniData", uniDataSchema);
module.exports = uniData;