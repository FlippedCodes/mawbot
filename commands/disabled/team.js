const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  const teamlist = message.guild.roles.get(config.team).members.map(s => s.presence.status).sort().join('\n');
  if (teamlist.indexOf('online' || 'dnd') >= 0) return message.reply('teammember(s) are **online**') && message.channel.send(teamlist);
  message.reply('teammember(s) are **offline** or **idle**');
};

module.exports.help = {
  name: 'team',
};
