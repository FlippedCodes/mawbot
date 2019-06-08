const rp = require('request-promise');
// TODO: get pool and child posts
// TODO: Remove reactions after some time
// TODO: changable prefix and saved to DB
// TODO: add pic resolution
// TODO: remove triggered recations. like expantion (needs permission checking before removal)

function missingPermissions(message) {
  message.reply('you are nowt allowoed to delewt this message <.<')
    .then(msg => msg.delete(10000));
}

function messageDelete(message, messageOwner) {
  if (messageOwner.has(message.id)) messageOwner.delete(message.id);
  message.delete();
}

  switch (reaction.emoji.name) {
    case '↔':
      const id = reaction.message.embeds[0].url.replace('https://e621.net/post/show/', '');
      const color = reaction.message.embeds[0].color;
      let e621_id = {
        method: 'POST',
        uri: 'https://e621.net/post/show.json',
        body: {
          id,
        },
        headers: {
          'User-Agent': 'Discordbot - Mawbot',
        },
        json: true,
      };
      rp(e621_id)
        .then((json) => {
          let source = 'none';
          let typeSources = 'Sources';
          if (json.sources) {
            source = json.sources.join('\n');
            if (json.sources.length === 1) typeSources = 'Source';
          }
          let rating = 'NSFW';
          if (json.rating === 's') rating = 'NSFW';
          let artists = json.artist.join(', ');
          let typeArtists = 'All artists';
          if (json.artist.length === 1) typeArtists = 'Artist';
          let arrow = '🔽';
          const extantion = json.file_ext;
          if (extantion === 'webm' || extantion === 'swf') arrow = json.file_url;
          let embed = new RichEmbed()
            .setAuthor(`${typeArtists}: ${json.artist[0]}`)
            .setColor(color)
            .setTitle('E621 Link')
            .setURL(`https://e621.net/post/show/${json.id}`)
            .setDescription(`**Tags:** ${json.tags}`)
            .addField('Rating', rating, true)
            .addField('Score', json.score, true)
            .addField('ID', json.id, true)
            .addField(typeSources, source)
            .addField('Full Picture link', json.file_url)
            .addField('Full Picture', arrow)
            .setImage(json.file_url)
            .setFooter(client.user.tag, client.user.displayAvatarURL)
            .setTimestamp();
          reaction.message.edit({ embed });
        });
      return;
    case '❌':
      if (!reaction.me) return;
      reaction.message.delete();
      return;
    default:
      return;
  }
};

module.exports.help = {
  name: 'e621_detailed',
};
