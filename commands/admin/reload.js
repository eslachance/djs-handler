exports.run = (client, message, args) => {
  if (!args || args.size < 1) {
    return message.reply("Must provide a command name to reload.");
  }
  const commandName = args[0];
  // Check if the command exists and is valid
  if (!client.commands.has(commandName)) {
    return message.reply("That command does not exist");
  }
  // Remove the cached version of this command, otherwise this would do nothing.
  // the path is relative to the *current folder*, so just ./filename.js
  Reflect.deleteProperty(require.cache, require.resolve(`./${commandName}.js`));
  // We also need to delete and reload the command from the client.commands Collection.
  client.commands.delete(commandName);

  // Now we reload the command.
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  message.reply(`The command ${commandName} has been reloaded`);
};
