// disabled for servers.rolerequest_night_dragon and voretv
module.exports.run = async (client, servers, config) => {
  [servers.rolerequest_main, servers.rolerequest_testing].forEach((server) => {
    if (!client.channels.get(server)) return;
    client.channels.get(server).bulkDelete(10);
    client.channels.get(server).send({
      embed: {
        color: 16777215,
        title: 'Rolerequest',
        description: `Click on the reactions to get the roles!\nPlease read <#${config.info_channelID}> for a more details about the roles!`,
        fields: [{
          name: 'Prey',
          value: ':one:',
          inline: true,
        },
        {
          name: 'Prey/Pred',
          value: ':two:',
          inline: true,
        },
        {
          name: 'Pred',
          value: ':three:',
          inline: true,
        },
        {
          name: 'No NSFW',
          value: ':four:',
          inline: true,
        },
        {
          name: 'NSFL Access',
          value: ':five:',
          inline: true,
        },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.displayAvatarURL,
          text: client.user.tag,
        },
      },
    })
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
