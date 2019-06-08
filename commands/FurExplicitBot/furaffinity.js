const furaffinity = require('furaffinity');

module.exports.run = async (client, message, args, config, functions, RichEmbed, messageOwner) => {
  if (args.length <= 0) return message.channel.send('Sorry, I couldn\'t find anything, because you didn\'t provide any tags. :(');

  // get user args
  const keywords = args.join(' ');

  // testcmd
  // message.channel.send(keywords);

  // check args
  // nothing here yet

  // cap max pics
  const limit = 1;

  // loop limit
  // not done yet

  // command get info
  furaffinity.search(keywords, limit).then((fa) => {
    // output
    if (fa[0]) {
      let image;
      let i;
      for (i = 0; i < 16; i++) {
        if (fa[0].src !== fa[0].src.replace(`@${i}00`, '@1600')) {
          image = fa[0].src.replace(`@${i}00`, '@1600');
          break;
        }
      }
      const embed = {
        title: fa[0].title,
        url: fa[0].url,
        color: message.channel.guild.members.get(client.user.id).displayColor,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.displayAvatarURL,
          text: client.user.username,
        },
        image: {
          url: image,
        },
        author: {
          name: fa[0].author.name,
          url: fa[0].author.url,
        },
      };
      message.channel.send({ embed });
    } else {
      message.channel.send('Sorry there are no pictures with these keywords.');
    }
  }).catch(err => console.log(err));
  // loop end
  // not here yet
};

module.exports.help = {
  name: 'fa',
};
