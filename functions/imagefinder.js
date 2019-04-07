const rp = require('request-promise');

const $ = require('cheerio');

const { RichEmbed } = require('discord.js');

module.exports.run = async (client, reaction, user, message, image) => {
  reaction.remove(user);
  message.react(message.guild.emojis.get('564375243662163968')).then((reaction_loading) => {
    const url = `http://iqdb.harry.lu/?url=${image}`;

    rp(url)
      .then((html) => {
        if ($('tbody > tr > th', html)[1].firstChild.data === 'Probable match:') {
          const raiting = $('tbody > tr', html)[6].firstChild.firstChild.data;
          // TODO: create function for better code
          // FIXME: jpg not working
          if (raiting !== '[Safe]') {
            if (message.channel.nsfw === false) {
              return message.channel.send('Sorry, but the piture I found is NSFW and can not be posted here.');
            }
          }
          const link = $('tr > td > a', html)[0].attribs.href;
          const img_id = $('tr > td > a > img', html)[0].attribs.src;
          const pic = img_id.replace('e621/', 'https://static1.e621.net/data/');
          const similarity = $('tbody > tr', html)[7].firstChild.firstChild.data;
          let embed = new RichEmbed()
            .setAuthor(raiting)
            .setTitle(`Probable match: ${similarity}`)
            .setColor(message.member.displayColor)
            .addField('e621 link:', link)
            .setImage(pic)
            .setFooter(client.user.tag, client.user.displayAvatarURL)
            .setTimestamp();
          message.channel.send({ embed });
        } else {
          message.react('❌');
        }
      })
      .catch((err) => {
        console.error(err);
      });
    reaction_loading.remove(client.user);
  });
};

module.exports.help = {
  name: 'imagefinder',
};
