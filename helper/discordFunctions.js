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
    console.log("User doesn't exist. Creating user");
    addUser = new uniData({
      name: nameReceived,
      unis: {}
    });
    addUser.save();
    return "";
  }
};

const changeUniStatus = (nameReceived, uni) => {
  uniData.findOne({ name: nameReceived }, function (err, res) {
    let personUniList = res.unis;
    personUniList[uni] = "Accepted";
    uniData.findOneAndUpdate(
      { name: nameReceived },
      { unis: personUniList },
      { returnOriginal: false },
      function (err, doc) {
        if (err) {
          console.log("Uni Status Error: " + err);
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

const addUni = async (uniName, username) => {
  let uniList = {};

  let list = await uniData
    .findOne({ name: username }, function (err, res) {})
    .clone();
  list = list.unis;

  for (var [uni, uniDecision] of Object.entries(list)) {
    uniList[uni] = uniDecision;
  }

  uniList[uniName] = "Undecided";

  uniData.findOne({ name: username }, function (err, res) {
    let personUniList = uniList;
    uniData.findOneAndUpdate(
      { name: username },
      { unis: personUniList },
      { returnOriginal: false },
      function (err, doc) {
        if (err) {
          console.log("Uni Status Error: " + err);
        }
      }
    );
  });

  return;
};

const removeUni = async (uniName, username) => {
  let uniList = {};

  let list = await uniData
    .findOne({ name: username }, function (err, res) {})
    .clone();
  list = list.unis;

  for (var [uni, uniDecision] of Object.entries(list)) {
    if (!(uni == uniName)) {
      uniList[uni] = uniDecision;
    }
  }

  uniData.findOne({ name: username }, function (err, res) {
    let personUniList = uniList;
    uniData.findOneAndUpdate(
      { name: username },
      { unis: personUniList },
      { returnOriginal: false },
      function (err, doc) {
        if (err) {
          console.log("Uni Status Error: " + err);
        }
      }
    );
  });

  return;
}

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
  addUni,
  removeUni,
};
