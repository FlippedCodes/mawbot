module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.team)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));
  let target;
  if (args[0]) {
    if (message.mentions.members.first() || message.guild.members.get(args[0])) {
      target = message.mentions.members.first() || message.guild.members.get(args[0]);
    } else { return message.channel.send('Sorry, but there is no user on this server with the information provided.'); }
  } else { target = message.member; }

  let user_color = 6447714;
  if (target.lastMessage) user_color = target.lastMessage.member.displayColor;

  const embed = {
    title: target.tag,
    url: target.avatarURL,
    color: user_color,
    timestamp: new Date(),
    image: {
      url: target.avatarURL,
    },
    footer: {
      icon_url: target.client.user.displayAvatarURL,
      text: target.client.user.tag,
    },
  };
  message.channel.send(`<${target.avatarURL}>`);
  await message.channel.send({ embed });
};

module.exports.help = {
  name: 'avatar',
};
