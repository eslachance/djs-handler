module.exports = client => {
  console.log(`Ready to server in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers,
For a total of ${client.users.cache.size} users.`);
};
