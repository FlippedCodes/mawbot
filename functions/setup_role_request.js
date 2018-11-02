// disabled for servers.rolerequest_night_dragon and voretv
module.exports.run = async (client, servers) => {
  [servers.rolerequest_main, servers.rolerequest_testing].forEach((server) => {
    if (!client.channels.get(server)) return;
    client.channels.get(server).bulkDelete(10);
    client.channels.get(server).send('Click on the reactions to get the roles!\nPlease read <#496948681656893440> for a more details about the roles!\n\n:one: Prey\n\n:two: Prey/Pred\n\n:three: Pred\n\n:four: No NSFW\n\n:five: NSFL Access')
      .then(async (message) => {
        await message.react('1⃣');
        await message.react('2⃣');
        await message.react('3⃣');
        await message.react('4⃣');
        await message.react('5⃣');
      });
  });
};

module.exports.help = {
  name: 'setup_role_request',
};
