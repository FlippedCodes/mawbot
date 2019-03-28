// disabled for servers.rolerequest_night_dragon and voretv
module.exports.run = async (client, servers) => {
  [servers.saveme_main, servers.saveme_testing].forEach((server) => {
    if (!client.channels.get(server)) return;
    client.channels.get(server).bulkDelete(10);
    client.channels.get(server).send('Click on the reaction to show that you are still active on this server!')
      .then(message => message.react('👌'));
  });
};

module.exports.help = {
  name: 'setup_saveme',
};
