const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find((role) => role.name === config.teamRole)) {
    message.channel.send(`Do I know you **${message.author.tag}**? Only the Devs can use this~`)
      .then(message.react('❌'));
    return;
  }

  const member = await message.mentions.members.first() || message.guild.members.get(args[0]);

  await member.removeRoles(member.roles);
  await member.addRole(config.mutedRole);
  await message.guild.channels.get(config.logChannel).send(`<@${message.author.id}> Muted User ${message.mentions.members.first()}`);
};

module.exports.help = {
  name: 'mute',
};
