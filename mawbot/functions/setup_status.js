module.exports.run = async (client, fs) => {
  client.user.setStatus('online');
  if (fs.existsSync('./mawbot/config/test_token.json')) {
    client.user.setActivity('with the Testaccount from Flipper');
  } else {
    client.user.setActivity(`${client.guilds.reduce((previousCount, currentGuild) => previousCount + currentGuild.memberCount, 0)} members in VoreNetwork`, { type: 'WATCHING' });
  }
};

module.exports.help = {
  name: 'setup_status',
};
