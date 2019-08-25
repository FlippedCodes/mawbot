module.exports.run = async (reaction, servers, user, client) => {
  if (user.bot) return;

  let config;
  if (reaction.message.guild.id === servers.main) {
    config = require('../config/main/config.json');
  }
  if (reaction.message.guild.id === servers.night_dragon) {
    config = require('../config/night_dragon/config.json');
  }
  if (reaction.message.guild.id === servers.voretv) {
    config = require('../config/voretv/config.json');
  }
  if (reaction.message.guild.id === servers.testing) {
    config = require('../config/testing/config.json');
  }

  if (reaction.message.channel.id === config.checkin_channelID) return;

  if (reaction.message.channel.id === servers.sharedChannel_night_dragon) return;
  if (reaction.message.channel.id === servers.sharedChannel_voretv) return;
  if (reaction.message.channel.id === servers.sharedChannel_NSFWnight_dragon) return;
  if (reaction.message.channel.id === servers.sharedChannel_NSFWvoretv) return;

  const embed = {
    title: `removed by: ${user.tag}`,
    url: user.avatarURL,
    description: `\nReaction: ${reaction.emoji.name}\n\nMessage: \`\`\`${reaction.message.cleanContent}\`\`\`\nmessage by: \`${reaction.message.author.tag}\`\n\nChannel: \`${reaction.message.channel.name}\`\n\nCategory: temp remove>console spam`,
    // \`${reaction.message.channel.parent.name}\`
    color: 16719133,
    timestamp: new Date(),
    footer: {
      icon_url: client.user.displayAvatarURL,
      text: client.user.tag,
    },
    author: {
      name: 'A reaction got removed!',
      icon_url: user.avatarURL,
    },
  };
  client.channels.get(config.logReactions).send({ embed });
};

module.exports.help = {
  name: 'reaction_remove',
};
