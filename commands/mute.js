const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find('name', config.teamRole)) {
    message.channel.send(`Do I know you **${message.author.tag}**? Only the Devs can use this~`)
      .then(message.react('❌'));
    return;
  }

  const member = await message.mentions.members.first() || message.guild.members.get(args[0]);

  await member.removeRoles(member.roles);
  await member.addRole(config.mutedRole);
  const fetchchannel = await message.guild.channels.get(config.logChannel);
  await fetchchannel.send(`<@${message.author.id}> Muted User ${message.mentions.members.first()}`);
};

module.exports.help = {
  name: 'mute',
};
