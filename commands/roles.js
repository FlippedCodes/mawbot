module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.adminRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));
  message.channel.send(message.guild.roles.map(role => role.name).sort().join('\n'));
};

module.exports.help = {
  name: 'roles',
};
