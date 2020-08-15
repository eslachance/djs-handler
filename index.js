// Load the Discord.js library
const Discord = require("discord.js");

// Load internal fs-related node libraries
const fs = require("fs");
const { resolve } = require("path");

// the walk module is necessary to easily read files in subfolders (commands).
const walk = require("walk");

// Require the config.json example. If it doesn't exist, rename the config.json.example to config.json
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// END FILE IMPORTS //

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;

// Open the events folder and read the files in it.
// Each file must be named the same thing as a discord.js event!
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    // If the file is not a JS file, ignore it (thanks, Apple)
    if (!file.endsWith(".js")) return;
    // Load the event file itself
    const event = require(`./events/${file}`);
    // Get just the event name from the file name
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    // without going into too many details, this means each event will be called with the client argument,
    // followed by its "normal" arguments, like message, member, etc etc.
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  });
});

// Create the Collections that hold the commands, as well as the command categories, and attach them to the client.
client.commands = new Discord.Collection();
client.categories = new Discord.Collection();

const walker = walk.walk("./commands");

// Walker will load all the commands in all the subfolders, such as /commands/admin/reload.js , etc.
walker.on("file", function (root, stats, next) {
  // Again, thanks Apple for .DS_STORE files. Lovely.
  if (!stats.name.endsWith(".js")) return;
  // Get the category name, as /commands/{category}/{commandname}.js
  const category = resolve(root).split("\\").slice(-1)[0];
  // Create the category if it doesn't exist.
  if (!client.categories.has(category)) {
    client.categories.set(category, []);
  }

  // Require the file in order to get its content.
  let props = require(`${resolve(root)}/${stats.name}`);
  // Remove the `.js` in the end.
  let commandName = stats.name.split(".")[0];
  console.log(`Attempting to load command ${commandName}`);

  // Set the command in the commands collection
  client.commands.set(commandName, props);
  // and add it to the category (this simplifies getting all the commands in a category!)
  client.categories.set(category, [
    ...client.categories.get(category),
    commandName,
  ]);
  // GOTO NEXT (that's a '90s joke for y'all)
  next();
});

// Log the client in, so it triggers the ready event and starts looking for messages.
client.login(config.token);
