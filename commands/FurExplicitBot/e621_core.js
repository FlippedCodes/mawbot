const rp = require('request-promise');

module.exports.run = async (client, message, args, config, functions, RichEmbed, messageOwner) => {
  message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji)).then((reaction_loading) => {
    let [limit] = args;
    let tags = args
      .join(' ')
      .slice(limit.length + 1)
      .replace(', ', ' ');
    if (isNaN(limit) || limit === 0) {
      functions.get('invalid_cmd').run(message, limit);
      reaction_loading.remove(client.user);
      return;
    }
    let uri = 'https://e621.net/post/index.json';
    if (message.channel.nsfw === false) uri = 'https://e926.net/post/index.json';
    if (limit > 10) {
      message.reply('you can only requwest a maximum of 10 images at the twime.');
      reaction_loading.remove(client.user);
      return;
    }
    if (limit > 3) {
      message.reply('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<')
        .then(msg => msg.delete(10000));
    }
    let request = {
      method: 'POST',
      uri,
      body: {
        limit: '300',
        tags,
      },
      headers: { 'User-Agent': 'Discordbot - Mawbot' },
      json: true,
    };
    rp(request)
      .then((json) => {
        if (json.length === 0) return message.channel.send('Sowwy, I found no pictures with your tags. uwu');
        for (let i = 0; i < limit; i++) {
          const randomChoice = Math.floor(Math.random() * json.length);
          let typePic = 'Preview';
          let picURL = json[randomChoice].sample_url;
          let arrow = '🔽';
          const extantion = json[randomChoice].file_ext;
          if (extantion === 'gif' || extantion === 'webm' || extantion === 'swf') {
            typePic = 'Full Picture';
            picURL = json[randomChoice].file_url;
            if (extantion === 'webm' || extantion === 'swf') arrow = json[randomChoice].file_url;
          }
          let embed = new RichEmbed()
            .setAuthor(`Main Artist: ${json[randomChoice].artist[0]}`)
            // .setColor(message.member.displayColor)
            .setTitle('E621 Link')
            .setURL(`https://e621.net/post/show/${json[randomChoice].id}`)
            .addField(typePic, arrow)
            .setImage(picURL)
            .setFooter(client.user.tag, client.user.displayAvatarURL)
            .setTimestamp();
          if (message.channel.type === 'DEFAULT') embed.setColor(message.member.displayColor);
          message.channel.send({ embed })
            .then((msg) => {
              msg.react('↔')
                .then(() => msg.react('❌'));
            });
        }
      })
      .then(() => {
        reaction_loading.remove(client.user);
      });
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'e6',
};
