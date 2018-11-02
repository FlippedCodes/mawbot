module.exports.run = async (client, message, blacklist, servers) => {
  let content = `\n${message.content}`;
  let blacklisted = false;

  Object.entries(blacklist).forEach(([key, value]) => {
    if (message.author.id === value) {
      content = '\nSorry, because of your recent behavior you are not allowed to use the vore-network anymore!';
      blacklisted = true;
    }
  });

  let code;
  if (message.channel.id === servers.sharedChannel_main) code = servers.invite_main;
  if (message.channel.id === servers.sharedChannel_testing) code = servers.invite_testing;
  if (message.channel.id === servers.sharedChannel_night_dragon) code = servers.invite_night_dragon;
  if (message.channel.id === servers.sharedChannel_voretv) code = servers.invite_voretv;

  let pic = 'https://cdn.discordapp.com/embed/avatars/0.png';
  if (message.author.avatarURL) pic = message.author.avatarURL;

  const embed = {
    // description: `\`\`\`${message.content}\`\`\``,
    description: content,
    title: `Server: ${message.guild.name}`,
    url: `https://discord.gg/${code}`,
    color: message.member.displayColor,
    timestamp: message.createdAt,
    // footer: {
    //   text: client.name,
    // icon_ur": 'https://cdn.discordapp.com/embed/avatars/0.png',
    // },
    author: {
      name: `${message.author.username} | ${message.author.tag}`,
      url: pic,
    },
    thumbnail: {
      url: pic,
    },
    // author: {
    //   name: `${message.author.username} | ${message.author.tag}`,
    //   url: message.author.avatarURL,
    // },
  };
  if (blacklisted === true) {
    message.channel.send({ embed });
  } else {
    [servers.sharedChannel_main, servers.sharedChannel_testing, servers.sharedChannel_night_dragon, servers.sharedChannel_voretv].forEach((server) => {
      if (client.channels.exists('id', server)) {
        client.channels.get(server).send({ embed })
          .catch(console.error);
      } else {
        message.reply(`Sorry, but the Server with the ID **${server}** seems not to be available. Please report this to the team or directly to the Developers!`);
      }
    });
  }
  await message.delete();
};

module.exports.help = {
  name: 'channel_shared_sfw',
};
