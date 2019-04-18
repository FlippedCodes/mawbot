/* eslint-disable no-unreachable */
const rp = require('request-promise');

const $ = require('cheerio');

const { RichEmbed } = require('discord.js');

module.exports.run = async (find, client, config, con, reaction, user, message, image) => {
  con.query(`SELECT * FROM image_channel WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
    if (rows[0]) {
      const url_imagefinder = `http://iqdb.harry.lu/?url=${image}`;

      rp(url_imagefinder)
        .then((html_imagefinder) => {
          if ($('tbody > tr > th', html_imagefinder)[1].firstChild.data === 'Probable match:') {
            const raiting = $('tbody > tr', html_imagefinder)[6].firstChild.firstChild.data;
            const url_e621 = $('tr > td > a', html_imagefinder)[0].attribs.href;
            const id = url_e621.replace('https://e621.net/post/show/', '');
            const similarity = $('tbody > tr', html_imagefinder)[7].firstChild.firstChild.data;
            let e621_json = {
              method: 'POST',
              uri: 'https://e621.net/post/show.json',
              body: { id },
              headers: { 'User-Agent': 'Mawbot' },
              json: true,
            };
            rp(e621_json)
              .then((json) => {
                switch (find) {
                  case 'search':
                    if (json.source) {
                      message.react('ℹ');
                    }
                    return;

                  case 'get':
                    if (reaction.users.find(bot => bot.id === client.user.id)) {
                      if (user.id === message.author.id || message.member.roles.find(role => role.name === config.teamRole)) {
                        if (raiting !== '[Safe]' && message.channel.nsfw === false) {
                          reaction.remove(user);
                          message.channel.send('Sorry, but the picture I found is rated NSFW on E621 and can not be posted here.')
                            .then(msg => msg.delete(10000));
                          return;
                        }
                        message.react(client.guilds.get('451833819910373406').emojis.get('564375243662163968')).then((reaction_loading) => {
                          reaction.remove(user);
                          reaction.remove(client.user);
                          let embed = new RichEmbed()
                            .setAuthor(raiting)
                            .setTitle(`Probable match: ${similarity}`)
                            .setColor(message.member.displayColor)
                            .setThumbnail(image)
                            .addField('Source link:', json.source)
                            .addField('E621 link:', url_e621)
                            .setFooter(client.user.tag, client.user.displayAvatarURL)
                            .setTimestamp();
                          message.channel.send({ embed })
                            .then(() => reaction_loading.remove(client.user));
                        });
                      } else {
                        reaction.remove(user);
                        message.channel.send('Sorry, you are not the publisher of this picture.')
                          .then(msg => msg.delete(10000));
                        return;
                      }
                    }
                    return;

                  default:
                    return;
                }
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
};

module.exports.help = {
  name: 'imagefinder',
};
