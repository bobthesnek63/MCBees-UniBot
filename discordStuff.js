const {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const {
  getUnisList,
  changeUniStatus,
  getUnisArray,
} = require("./helper/discordFunctions");
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
    
    global.name = interaction.user.username;

    let ans = await getUnisList(global.name);
    global.arr = await getUnisArray(global.name);
    await interaction.update({
      content: `Which of these programs did you get accepted to?\n${ans}`,
      components: [],
    });
  }

  if (interaction.customId == "chance") {
    await interaction.update({
      content: "You have a 100% chance of getting into your top choice!",
      components: [],
    });
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.content == "!show") {
    if (
      msg.channelId == process.env.UNIBOT_THREAD ||
      msg.channelId == process.env.BOT_TESTING ||
      msg.channelId == process.env.UNIBOT_CHANNEL
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
      if (msg.content.toUpperCase() == global.arr[i].toUpperCase()) {
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
