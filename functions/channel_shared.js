const Discord = require('discord.js');

module.exports.run = async (client, message, con) => {
  // banned user filter
  con.query(`SELECT * FROM shared_channels_banned WHERE userID = '${message.author.id}'`, async (err, rows) => {
    if (rows[0]) {
      message.react('❌');
      return message.channel.send('\nSorry, because of your recent behavior you are not allowed to use the vore-network anymore!');
    }

    // no userpic fallback
    let pic = 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (message.author.avatarURL) pic = message.author.avatarURL;

    con.query('SELECT * FROM shared_channels', async (err, rows) => {
      rows.forEach((ID) => {
        const vorenetwork_channel = client.channels.find(channel => channel.id === ID.channelID);
        if (vorenetwork_channel.id !== message.channel.id) {
          const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, pic)
            .setColor(message.member.displayColor)
            .setDescription(message.content)
            .setTimestamp()
            .setFooter(message.channel.guild.name, message.guild.iconURL);
          vorenetwork_channel.send({ embed })
            .catch((error) => {
              console.log(error);
              message.channel.send('Something went wrong sending the message to one of the other servers. Please report this to the Team.');
              return;
            });
        // webhook solution
        // con.query(`SELECT * FROM shared_channels WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
        // vorenetwork_channel.fetchWebhooks()
        //   .then((webhook) => {
        //     const hook = webhook.find(hook => hook.name === rows[0].webhookName);
        //     hook.send(`[${message.channel.guild.name}]\n${message.content}`, {
        //       username: message.author.username,
        //       avatarURL: pic,
        //     })
        //       .catch((error) => {
        //         console.log(error);
        //         message.channel.send('Something went wrong sending the message to one of the other servers. Please report this to the Team.');
        //         return;
        //       });
        //   });
        // });
        }
      });
    });
  });
};

module.exports.help = {
  name: 'channel_shared',
};
