const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find('name', config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the Team can use this~`).then(message.react('❌'));

  message.channel.send(args.join(' '));
  message.delete();
};

module.exports.help = {
  name: 'speak',
};
