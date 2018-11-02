module.exports.run = async (client, fs) => {
  client.user.setStatus('online');
  if (fs.existsSync('./config/test_token.json')) {
    client.user.setActivity('with the Testaccount from Flipper');
  } else {
    client.user.setActivity(`over ${client.guilds.reduce((previousCount, currentGuild) => previousCount + currentGuild.memberCount, 0)} members in DTM`, { type: 'WATCHING' });
  }
};

module.exports.help = {
  name: 'setup_status',
};
