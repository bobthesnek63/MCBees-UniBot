const uniData = require("../mongoDB/model");
const editJsonFile = require("edit-json-file");

const getUnisList = async (nameReceived) => {
  try {
    let list = await uniData
      .findOne({ name: nameReceived }, function (err, res) {})
      .clone();

    let ans = "**";
    list = list.unis;

    for (var i in list) {
      if (list[i] == "Accepted") {
        ans += i + "✅";
        ans += "\n";
      } else {
        ans += i;
        ans += "\n";
      }
    }
    ans += "**";
    return ans;
  } catch (err) {
    console.log(err);
  }
};

const changeUniStatus = (nameReceived, uni) => {

  uniData.findOne({ name: nameReceived }, function (err, res) {
    let personUniList = res.unis;
    personUniList[uni] = "Accepted";
    console.log(personUniList);
    uniData.findOneAndUpdate(
      { name: nameReceived },
      { unis: personUniList },
      { returnOriginal: false },
      function (err, doc) {
        if (err) {
          console.log("Something went wrong with the upload");
        }
      }
    );
  });
};

const getUnisArray = async (nameReceived) => {
  let ans = [];

  let list = await uniData.findOne({ name: nameReceived }).clone();
  list = list.unis;

  for (var i in list) {
    ans.push(i);
  }

  return ans;
};

const addPersonToDatabase = () => {
  let file = editJsonFile(`${__dirname}/unis.json`);
  file.set(`${name}.${uni}`, "Accepted");
  file.save();

  delete require.cache[require.resolve("./unis.json")];
  unisJson = require("./unis.json");
};

module.exports = {
  getUnisList,
  changeUniStatus,
  getUnisArray,
  addPersonToDatabase,
};
