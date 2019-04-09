const rp = require('request-promise');

const $ = require('cheerio');

const { RichEmbed } = require('discord.js');

module.exports.run = async (client, config, con, reaction, user, message, image) => {
  reaction.remove(user);
  con.query(`SELECT * FROM image_channel WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
    if (rows[0] || message.member.roles.find(role => role.name === config.teamRole)) {
      if (user.id !== message.author.id) {
        reaction.remove(user);
        message.channel.send('Sorry, you are not the publisher of this picture.')
          .then(msg => msg.delete(10000));
        return;
      }
      message.react(client.guilds.get('451833819910373406').emojis.get('564375243662163968')).then((reaction_loading) => {
        const url_imagefinder = `http://iqdb.harry.lu/?url=${image}`;

        rp(url_imagefinder)
          .then((html_imagefinder) => {
            if ($('tbody > tr > th', html_imagefinder)[1].firstChild.data === 'Probable match:') {
              const raiting = $('tbody > tr', html_imagefinder)[6].firstChild.firstChild.data;
              // FIXME: jpg pictures not working
              if (raiting !== '[Safe]') {
                if (message.channel.nsfw === false) {
                  message.channel.send('Sorry, but the piture I found is rated NSFW on E621 and can not be posted here.')
                    .then(msg => msg.delete(10000));
                  return;
                }
              }
              const url_e621 = $('tr > td > a', html_imagefinder)[0].attribs.href;
              const e621_postID = url_e621.replace('https://e621.net/post/show/', '');
              // const img_id = $('tr > td > a > img', html_imagefinder)[0].attribs.src;
              // const pic = img_id.replace('e621/', 'https://static1.e621.net/data/');
              const similarity = $('tbody > tr', html_imagefinder)[7].firstChild.firstChild.data;
              let e621_json = {
                method: 'POST',
                uri: 'https://e621.net/post/show.json',
                body: {
                  id: e621_postID,
                },
                headers: {
                  'User-Agent': 'Mawbot',
                },
                json: true,
              };
              rp(e621_json)
                .then((json) => {
                  let embed = new RichEmbed()
                    .setAuthor(raiting)
                    .setTitle(`Probable match: ${similarity}`)
                    .setColor(message.member.displayColor)
                    .setThumbnail(image)
                    .addField('Source link:', json.source)
                    .addField('E621 link:', url_e621)
                    .setFooter(client.user.tag, client.user.displayAvatarURL)
                    .setTimestamp();
                  message.channel.send({ embed });
                })
                .catch(() => message.react('❌'));
            } else {
              message.react('❌');
            }
          })
          .then(() => reaction_loading.remove(client.user))
          .catch((err) => {
            console.error(err);
          });
      });
    } else {
      message.reply('Sorry, but I am not allowed to give you the source in this channel.')
        .then(msg => msg.delete(10000));
      return;
    }
  });
};

module.exports.help = {
  name: 'imagefinder',
};
