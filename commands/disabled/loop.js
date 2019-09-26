const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (message.author.id !== config.ownerID) return message.channel.send(`Do I know you **${message.author.tag}**? Only Phil can use this~`).then(message.react('❌'));
  const teamlist = message.guild.roles.get(config.team).members.map(s => s.presence.status).sort().join('\n');
  setInterval(() => {
    if (teamlist.indexOf('online' || 'dnd' || 'idle') >= 0) {
      message.channel.send('teammember(s) are **online**')
        .catch(console.error);
      message.channel.send(teamlist).then((msg) => {
        message.channel.send(`message send at ${msg.createdAt}\n-------------`);
      });
      return;
    }
    message.channel.send('teammember(s) are **offline**').then((msg) => {
      message.channel.send(`message send at ${msg.createdAt}\n-------------`);
    });
  }, 1 * 300000);
};

module.exports.help = {
  name: 'loop',
};
