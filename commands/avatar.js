module.exports.run = async (client, message, args, con, config) => {
  // id not working
  // const target = message.mentions.users.first() || message.guild.members.get(args[0]) || message.author;
  const target = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;

  let user_color = 6447714;
  if (target.lastMessage) user_color = target.lastMessage.member.displayColor;

  const embed = {
    title: target.user.tag,
    url: target.user.displayAvatarURL,
    color: target.colorRole.color,
    timestamp: new Date(),
    image: {
      url: target.user.displayAvatarURL,
    },
    footer: {
      icon_url: target.client.user.displayAvatarURL,
      text: target.client.user.tag,
    },
  };
  message.channel.send(`<${target.user.displayAvatarURL}>`);
  await message.channel.send({ embed });
};

module.exports.help = {
  name: 'avatar',
};
