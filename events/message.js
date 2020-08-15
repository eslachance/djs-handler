module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (!message.content.startsWith(client.config.prefix)) return;

  // Our standard argument/command name definition.
  // See https://anidiots.guide/v/v12/first-bot/command-with-arguments for details.
  const args = message.content.slice(client.config.prefix.length).split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Collection
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, message, args);
};
