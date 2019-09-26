// disabled for servers.rolerequest_night_dragon and voretv
const { RichEmbed } = require('discord.js');

module.exports.run = async (client, servers, config) => {
  [servers.rolerequest_main, servers.rolerequest_testing].forEach((server) => {
    if (!client.channels.get(server)) return;
    client.channels.get(server).bulkDelete(10);
    let embed = new RichEmbed()
      .setTitle('Rolerequest')
      .setDescription(`Click on the reactions to get the roles!\nPlease read <#${config.info_channelID}> for a more details about the roles!`)
      .addField('Prey', '🦌', true)
      .addField('Prey/Pred', '🔄', true)
      .addField('Pred', '🐉', true)
      .addField('NSFW Access', '🔞', true)
      .addField('NSFL Access', '💩', true)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    client.channels.get(server).send({ embed })
      .then(async (message) => {
        await message.react('🦌');
        await message.react('🔄');
        await message.react('🐉');
        await message.react('🔞');
        await message.react('💩');
      });
  });
};

module.exports.help = {
  name: 'setup_role_request',
};
