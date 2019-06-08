// const { Recent, Type, Login } = require('furaffinity');

// Login(config.cookieA, config.cookieB);

// module.exports.run = async (client, message, args, config, functions, RichEmbed, messageOwner) => {
//   message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji)).then((reaction_loading) => {
//     let [limit] = args;
//     let arrow = '🔽';
//     let tags = args
//       .join(' ')
//       .slice(limit.length + 1)
//       .replace(', ', ' ');
//     if (isNaN(limit) || limit === 0) {
//       functions.get('invalid_cmd').run(message, limit);
//       reaction_loading.remove(client.user);
//       return;
//     }
//     // TODO: change to different rating system for NSF/L content
//     let uri = 'https://e621.net/post/index.json';
//     if (message.channel.nsfw === false) uri = 'https://e926.net/post/index.json';
//     if (limit > 10) {
//       message.reply('you can only requwest a maximum of 10 images at the twime.');
//       reaction_loading.remove(client.user);
//       return;
//     }
//     if (limit > 3) {
//       message.reply('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<')
//         .then(msg => msg.delete(10000));
//     }
//     // let embed = new RichEmbed()
//     //   .setAuthor(`Artist: ${json[randomChoice].artist[0]}`)
//     // // .setColor(message.member.displayColor)
//     //   .setTitle('E621 Link')
//     //   .setURL(`https://e621.net/post/show/${json[randomChoice].id}`)
//     //   .addField(link, arrow)
//     //   .setImage(picURL)
//     //   .setFooter(client.user.tag, client.user.displayAvatarURL)
//     //   .setTimestamp();
//     // if (message.channel.type === 'DEFAULT') embed.setColor(message.member.displayColor);
//     // message.channel.send({ embed })
//       // .then((msg) => {
//       //   msg.react('↔')
//       //     .then(() => msg.react('❌'));
//       // });
//   })
//     .catch((err) => {
//       message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
//         .then(() => message.react('❌'));
//       console.error(err);
//     });
// };

// module.exports.help = {
//   name: 'newfa',
// };
