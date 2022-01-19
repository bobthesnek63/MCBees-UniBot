const mongoose = require("mongoose");
const uniData = require("./model");
const uniJSON = require("../unis.json");
require("dotenv").config({ path: "./.env" });

const uri = `mongodb+srv://bobthesnek63:${process.env.MONGO_KEY}@cluster0.b8lel.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.Promise = global.Promise;
mongoose.connect(uri);

mongoose.connection
  .once("open", () => {
    uniData.count({}, (err, count) => {
      // console.log("Entry number: " + count);

      if (count === 8) {
        var pranav = new uniData({
          name: "bobthesnek63",
          unis: uniJSON["bobthesnek63"],
        });
        var zoya = new uniData({
          name: "zoya",
          unis: uniJSON["zoya"],
        });
        var haram = new uniData({
          name: "haram",
          unis: uniJSON["haram"],
        });
        var dev = new uniData({
          name: "singhster",
          unis: uniJSON["singhster"],
        });
        var zayed = new uniData({
          name: "zayed.kherani",
          unis: uniJSON["zayed.kherani"],
        });
        var ziad = new uniData({
          name: "im gonna start going, start goin",
          unis: uniJSON["im gonna start going, start goin"],
        });
        var zimo = new uniData({
          name: "zix",
          unis: uniJSON["zix"],
        });
        var iman = new uniData({
          name: ".iman.",
          unis: uniJSON[".iman."],
        });
        
        pranav.save();
        zoya.save();
        haram.save();
        dev.save();
        zayed.save();
        ziad.save();
        zimo.save();
        iman.save();
      } else if (count === 8){
        var boshra = new uniData({
          name: "breakititsfine",
          unis: uniJSON["breakititsfine"],
        });
        var jake = new uniData({
          name: "jshin4",
          unis: uniJSON["jshin4"],
        });

        boshra.save();
        jake.save();
      }
    });
  })
  .on("error", (err) => {
    console.log("Connection Error: " + err);
  });
