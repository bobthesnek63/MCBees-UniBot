const {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
let unisJson = require("./unis.json");
const uniData = require("./mongoDB/model");
const editJsonFile = require("edit-json-file");
const { channel } = require("diagnostics_channel");
require("dotenv").config({ path: "./.env" });

global.arr = [];
global.name = "";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId == "accept") {
    console.log(interaction);
    global.name = interaction.user.username;

    let ans = await getUnisList(global.name);
    global.arr = await getUnisArr(global.name);

    interaction.update({
      content: `Which of these programs did you get accepted to?\n${ans}`,
      components: [],
    });
  }

  if (interaction.customId == "chance") {

    interaction.update({
      content: "You have a 100% chance of getting into your top choice!",
      components: [],
    });
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.content == "!show") {
    if (
      msg.channelId == "933150268852408330" ||
      msg.channelId == "933473094968946768"
    ) {
      let name = msg.author.username;
      let uniList = await getUnisList(name);

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("accept")
          .setLabel("Accept")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId("chance")
          .setLabel("Chances")
          .setStyle("DANGER")
      );

      msg.reply({
        content: `Here are your current uni programs!\n${uniList}`,
        components: [row],
      });
    }
  }

  // Finds Program name and updates
  if (
    global.arr.length != 0 &&
    msg.author.username == global.name &&
    msg.content != "!accept"
  ) {
    var found = false;
    for (var i = 0; i < global.arr.length; ++i) {
      if (msg.content == global.arr[i]) {
        found = true;
        changeUniStatus(global.name, global.arr[i]);
        msg.reply("CONGRATS ON GETTING IN! Your Uni record has been updated");
        global.name = "";
        global.arr = [];
        return;
      }
    }
    if (!found) {
      global.name = "";
      global.arr = [];
      msg.reply(
        "You have not applied to that program. Please try again from !accept"
      );
      return;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

// function addPerson(){
//     let file = editJsonFile(`${__dirname}/unis.json`);
//     file.set(`${name}.${uni}`, "Accepted");
//     file.save();

//     delete require.cache[require.resolve("./unis.json")];
//     unisJson = require("./unis.json");
// }

function changeUniStatus(nameRec, uni) {
  uniData.findOne({ name: nameRec }, function (err, res) {
    let personUniList = res.unis;
    personUniList[uni] = "Accepted";
    console.log(personUniList);
    uniData.findOneAndUpdate(
      { name: nameRec },
      { unis: personUniList },
      { returnOriginal: false },
      function (err, doc) {
        if (err) {
          console.log("Something went wrong with the upload");
        }

        // console.log(doc);
      }
    );
  });
}

async function getUnisList(nameRec) {
  try {
    let list = await uniData
      .findOne({ name: nameRec }, function (err, res) {})
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
}

async function getUnisArr(name) {
  let ans = [];

  let list = await uniData.findOne({ name: name }).clone();
  list = list.unis;

  for (var i in list) {
    ans.push(i);
  }

  return ans;
}
