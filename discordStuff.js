const {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const {
  changeUniStatus,
  getUnisArray,
  getUnisList,
  addUni,
  removeUni,
} = require("./helper/discordFunctions");

require("dotenv").config({ path: "./.env" });

global.arr = [];
global.name = "";
global.added = false;
global.removed = false;

global.mode = "";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

//TODO: enable
client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "!show",
        type: "LISTENING",
      },
    ],
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId == "accept") {
    global.mode = "accept";

    global.name = interaction.user.username;

    let ans = await getUnisList(global.name);
    global.arr = await getUnisArray(global.name);
    await interaction.update({
      content: `Which of these programs did you get accepted to?\n${ans}`,
      components: [],
    });
  }

  if (interaction.customId == "chance") {
    if (interaction.user.username == "zayed.kherani") {
      await interaction
        .update({
          content:
            "You have 0% chance of getting into your top choice, please leave.",
          components: [],
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await interaction
        .update({
          content: "You have a 100% chance of getting into your top choice!",
          components: [],
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  if (interaction.customId == "addUni") {
    global.name = interaction.user.username;
    global.added = true;
    global.mode = "add";

    await interaction.update({
      content: "Which university program did you want to add?",
      components: [],
    });
  }

  if (interaction.customId == "remove") {
    global.name = interaction.user.username;

    global.name = interaction.user.username;
    global.removed = true;
    global.mode = "remove";

    let ans = await getUnisList(global.name);
    global.arr = await getUnisArray(global.name);

    await interaction.update({
      content: `Which of these programs did you want to remove?\n${ans}`,
      components: [],
    });
  }

  if (interaction.customId == "reject") {
    global.mode = "reject";

    global.name = interaction.user.username;

    let ans = await getUnisList(global.name);
    global.arr = await getUnisArray(global.name);
    await interaction.update({
      content: `Which of these programs did you get rejected from?\n${ans}`,
      components: [],
    });
  }
});

client.on("messageCreate", async (msg) => {
  console.log(msg.content);
  if (
    msg.channelId == process.env.UNIBOT_THREAD ||
    msg.channelId == process.env.BOT_TESTING ||
    msg.channelId == process.env.UNIBOT_CHANNEL
  ) {
    if (msg.content == "!show") {
      
      let name = msg.author.username;
      let uniList = await getUnisList(name);

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("accept")
          .setLabel("Accept")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId("addUni")
          .setLabel("Add")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId("chance")
          .setLabel("Chances")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("remove")
          .setLabel("Remove")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("reject")
          .setLabel("Reject")
          .setStyle("DANGER")
      );

      if (process.env.BOT_TESTING == null) {
        msg.reply({
          content: `Here are your current uni programs!\n${uniList}`,
          components: [row],
        });
      } else {
        msg.reply({
          content: `**IN TESTING**\nHere are your current uni programs!\n${uniList}`,
          components: [row],
        });
      }


      // checks if user is trying to find someone elses university choices
    } else if (
      msg.content.slice(0, 5) == "!show" &&
      msg.content.slice(6, 8) == "<@"
    ) {
      let name = client.users.fetch(
        msg.content.slice(8, msg.content.length - 1)
      );
      name = (await name).username;
      let uniList = await getUnisList(name);

      msg.reply({
        content: `Here are ${name}'s current uni programs!\n${uniList}`,
      });
    }
  }

  // Finds program name and updates users list
  if (
    global.mode == "accept" &&
    msg.author.username == global.name &&
    msg.content != "!accept"
  ) {
    var found = false;
    for (var i = 0; i < global.arr.length; ++i) {
      if (msg.content.toLowerCase() == global.arr[i].toLowerCase()) {
        found = true;
        changeUniStatus(global.name, global.arr[i], "accept");
        msg.reply("CONGRATS ON GETTING IN! Your Uni record has been updated");
        global.name = "";
        global.arr = [];

        global.mode = "";

        return;
      }
    }
    if (!found) {
      global.name = "";
      global.arr = [];
      msg.reply("You have not applied to that program. Please try again");
      return;
    }
  }

  if (
    global.mode == "reject" &&
    msg.author.username == global.name &&
    msg.content != "!reject"
  ) {
    var found = false;
    for (var i = 0; i < global.arr.length; ++i) {
      if (msg.content.toLowerCase() == global.arr[i].toLowerCase()) {
        found = true;
        changeUniStatus(global.name, global.arr[i], "reject");
        msg.reply("They really missed out huh? Don't worry, it's their loss");
        global.name = "";
        global.arr = [];
        global.mode = "";

        return;
      }
    }
    if (!found) {
      global.name = "";
      global.arr = [];
      msg.reply("You have not applied to that program. Please try again");
      return;
    }
  }

  if (
    global.mode == "add" &&
    msg.author.username == global.name &&
    msg.content != "!addUni"
  ) {
    if (msg.author.username == global.name) {
      await addUni(msg.content, msg.author.username);

      msg.reply("Congrats on applying! Your record has been updated");

      global.mode = "";
    }

    return;
  }

  if (
    global.mode == "remove" &&
    msg.author.username == global.name &&
    msg.content != "!remove"
  ) {
    var found = false;
    for (var i = 0; i < global.arr.length; ++i) {
      if (msg.content.toLowerCase() == global.arr[i].toLowerCase()) {
        found = true;
        removeUni(global.arr[i], msg.author.username);

        msg.reply(
          `${global.arr[i]} has been removed. Your record has been updated`
        );

        global.mode = "";

        return;
      }
    }

    if (!found) {
      global.name = "";
      global.arr = [];
      msg.reply("You have not applied to that program. Please try again");
      return;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
