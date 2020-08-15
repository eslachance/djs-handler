// prettier-ignore
exports.run = (client, message) => {
  // Note that this help is very basic, doesn't have descriptions or anything else.

  // Start a loop on each category. We're using Collection.map() to get an array.
  const helpMessage = client.categories.map((commands, category) => `***${category}***:
\`\`\`
${commands.map(command => `${client.config.prefix}${command}`).join(" ; ")}
\`\`\``);
  message.channel.send(helpMessage);
};
