const Discord = require('discord.js');

module.exports.run = async (client, message, con) => {
  // banned user filter
  con.query(`SELECT * FROM shared_channels_banned WHERE userID = '${message.author.id}'`, async (err, rows) => {
    if (rows[0]) {
      message.react('❌');
      return message.channel.send('Sorry, because of your recent behavior you are not allowed to use the vore-network anymore!');
    }

    // no userpic fallback
    let pic = 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (message.author.avatarURL) pic = message.author.avatarURL;

    con.query('SELECT * FROM shared_channels', async (err, rows) => {
      rows.forEach((CHANNEL) => {
        // get channel
        const vorenetwork_channel = client.channels.find(channel => channel.id === CHANNEL.channelID);
        // check if channel exists
        if (!vorenetwork_channel) return;
        // check if sfw or nsfw
        if (message.channel.nsfw && !vorenetwork_channel.nsfw) return;
        if (!message.channel.nsfw && vorenetwork_channel.nsfw) return;

        // check if its from channel where it has beed send from
        if (vorenetwork_channel.id !== message.channel.id) {
          // Post shared message on all servers
          const embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, pic)
            .setColor(message.member.displayColor)
            .setDescription(message.content)
            .setTimestamp()
            .setFooter(message.channel.guild.name, message.guild.iconURL);
          // add invite, if provided in DB
          let orginalChannel = rows.get(message.channel.id);
          if (orginalChannel.inviteCode) embed.setAuthor(message.author.tag, pic, `https://discord.gg/${orginalChannel.inviteCode}`);
          vorenetwork_channel.send({ embed })
            .catch((error) => {
              console.log(error);
              message.channel.send('Something went wrong sending the message to one of the other servers. Please report this to the Team.');
              return;
            });
        }
      });
    });
  });
};

module.exports.help = {
  name: 'channel_shared',
};
