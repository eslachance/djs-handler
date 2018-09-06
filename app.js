const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const { resolve } = require("path");
const walk = require('walk');

const client = new Discord.Client();
const config = require("./config.json");
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();
client.categories = new Enmap();

const walker = walk.walk("./commands");

walker.on("file", function (root, stats, next) {
  if (!stats.name.endsWith(".js")) return;
  const category = resolve(root).split("\\").slice(-1)[0];
  client.categories.ensure(category, []);
  let props = require(`${resolve(root)}/${stats.name}`);
  let commandName = stats.name.split(".")[0];
  console.log(`Attempting to load command ${commandName}`);
  client.commands.set(commandName, props);
  client.categories.push(category, commandName);
  next();
});

client.login(config.token);
