module.exports.run = async (user, config, client, reaction) => {
  const embed = {
    title: `added by: ${user.tag}`,
    url: user.avatarURL,
    description: `\nReaction: ${reaction.emoji.name}\n\nMessage: \`\`\`${reaction.message.cleanContent}\`\`\`\nmessage by: \`${reaction.message.author.tag}\`\n\nChannel: \`${reaction.message.channel.name}\`\n\nCategory: temp remove>console spam`,
    color: 43540,
    timestamp: new Date(),
    footer: {
      icon_url: client.user.displayAvatarURL,
      text: client.user.tag,
    },
    author: {
      name: 'A reaction got added!',
      icon_url: user.avatarURL,
    },
  };
  client.channels.get(config.logReactions).send({ embed });
};

module.exports.help = {
  name: 'reaction_add_log',
};
