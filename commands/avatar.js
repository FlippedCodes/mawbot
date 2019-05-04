const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.team)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));
  let target;
  if (args[0]) {
    if (message.mentions.members.first() || message.guild.members.get(args[0])) {
      target = message.mentions.members.first() || message.guild.members.get(args[0]);
    } else { return message.channel.send('Sorry, but there is no user on this server with the information provided.'); }
  } else { target = message.member; }

  message.guild.fetchMember(target)
    .then((member) => {
      let embed = new RichEmbed()
        .setTitle(member.user.tag)
        .setURL(member.user.avatarURL)
        .setColor(member.displayColor)
        .setImage(member.user.avatarURL)
        .setFooter(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp();
      message.channel.send({ embed });
    });
};

module.exports.help = {
  name: 'avatar',
};
