module.exports.run = async (client, message, con) => {
  let content = `\n${message.content}`;
  // let blacklisted = false;

  // no pic fallback
  let pic = 'https://cdn.discordapp.com/embed/avatars/0.png';
  if (message.author.avatarURL) pic = message.author.avatarURL;

  con.query('SELECT * FROM shared_channels', async (err, rows) => {
    rows.forEach((ID) => {
      const vorenetwork_channel = client.channels.find(channel => channel.id === ID.channelID);
      if (vorenetwork_channel !== message.channel.id) {
        con.query(`SELECT * FROM shared_channels WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
          vorenetwork_channel.fetchWebhooks()
            .then((webhook) => {
              const hook = webhook.find(hook => hook.name === rows[0].webhookName);
              hook.send(message.content, {
                username: message.author.username,
                avatarURL: pic,
              })
                .catch((error) => {
                  console.log(error);
                  message.channel.send('Something went wrong sending the message to one of the other servers. Please report this to the Team.');
                  return;
                });
            });
        });
      }
    });
  });

  // TODO: need redo with db
  // Object.entries(blacklist).forEach(([key, value]) => {
  //   if (message.author.id === value) {
  //     content = '\nSorry, because of your recent behavior you are not allowed to use the vore-network anymore!';
  //     blacklisted = true;
  //   }
  // });

  // serverlink cant be shared over webhook
  // let code;
  // if (message.channel.id === servers.sharedChannel_main) code = servers.invite_main;
  // if (message.channel.id === servers.sharedChannel_testing) code = servers.invite_testing;
  // if (message.channel.id === servers.sharedChannel_night_dragon) code = servers.invite_night_dragon;
  // if (message.channel.id === servers.sharedChannel_voretv) code = servers.invite_voretv;

  // using webhook - no embet (backup)
  // const embed = {
  //   // description: `\`\`\`${message.content}\`\`\``,
  //   description: content,
  //   title: `Server: ${message.guild.name}`,
  //   url: `https://discord.gg/${code}`,
  //   color: message.member.displayColor,
  //   timestamp: message.createdAt,
  //   // footer: {
  //   //   text: client.name,
  //   // icon_ur": 'https://cdn.discordapp.com/embed/avatars/0.png',
  //   // },
  //   author: {
  //     name: `${message.author.username} | ${message.author.tag}`,
  //     url: pic,
  //   },
  //   thumbnail: {
  //     url: pic,
  //   },
  //   // author: {
  //   //   name: `${message.author.username} | ${message.author.tag}`,
  //   //   url: message.author.avatarURL,
  //   // },
  // };
  // // if (blacklisted === true) {
  // //   message.channel.send({ embed });
  // // } else {
  // [servers.sharedChannel_main, servers.sharedChannel_testing, servers.sharedChannel_night_dragon, servers.sharedChannel_voretv].forEach((server) => {
  //   if (client.channels.exists('id', server)) {
  //     client.channels.get(server).send({ embed })
  //       .catch(console.error);
  //   } else {
  //     message.reply(`Sorry, but the Server with the ID **${server}** seems not to be available. Please report this to the team or directly to the Developers!`);
  //   }
  // });
  // // }
  // await message.delete();
};

module.exports.help = {
  name: 'channel_shared_sfw',
};
