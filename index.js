/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const fetch = require("node-fetch");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/Util");

const client = new Client({ disableMentions: "everyone" });
const COMMAND_PREFIX = PREFIX;
const sadWords = ["sad", "depressed", "unhappy", "angry"];
const encouragements = ["Cheer up!", "Hang in there.", "You are a great person / bot!"];
let responding = true;

function updateEncouragements(encouragingMessage) {
  encouragements.push(encouragingMessage);
}

function deleteEncouragement(index) {
  if (encouragements.length > index) {
    encouragements.splice(index, 1);
  }
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => res.json())
    .then((data) => `${data[0]["q"]} -${data[0]["a"]}`);
}

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Webserver Initialisation
 */
const keepAlive = require('./alive.js')
keepAlive()

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const content = message.content.trim();
  const lower = content.toLowerCase();

  if (content === `${COMMAND_PREFIX}inspire`) {
    try {
      const quote = await getQuote();
      message.channel.send(quote);
    } catch (error) {
      console.error(error);
      message.channel.send("Could not fetch a quote right now.").catch(console.error);
    }
  }

  if (responding && sadWords.some((word) => lower.includes(word))) {
    if (encouragements.length > 0) {
      const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      message.reply(encouragement);
    }
  }

  if (content.startsWith(`${COMMAND_PREFIX}new `)) {
    const encouragingMessage = content.split(`${COMMAND_PREFIX}new `)[1];
    if (encouragingMessage) {
      updateEncouragements(encouragingMessage);
      message.channel.send("New encouraging message added.");
    }
  }

  if (content.startsWith(`${COMMAND_PREFIX}del `)) {
    const index = parseInt(content.split(`${COMMAND_PREFIX}del `)[1], 10);
    if (!Number.isNaN(index)) {
      deleteEncouragement(index);
      message.channel.send("Encouraging message deleted.");
    }
  }

  if (content.startsWith(`${COMMAND_PREFIX}list`)) {
    message.channel.send(encouragements);
  }

  if (content.startsWith(`${COMMAND_PREFIX}responding `)) {
    const value = content.split(`${COMMAND_PREFIX}responding `)[1];
    if (value && value.toLowerCase() === "true") {
      responding = true;
      message.channel.send("Responding is on.");
    } else if (value) {
      responding = false;
      message.channel.send("Responding is off.");
    }
  }

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});
