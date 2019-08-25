const { RichEmbed } = require('discord.js');

const rp = require('request-promise');

const fs = require('fs');

const uri = 'https://discordapp.com/api/users/';

let tokenAPI;

if (fs.existsSync('./mawbot/config/test_token.json')) {
  const api = require('../config/test_token.json');
  tokenAPI = api.APItoken;
} else {
  tokenAPI = process.env.APItoken;
}

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.team)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  let [id] = args;

  if (!id) return message.channel.send('Please provide ID!');

  let request = {
    method: 'GET',
    uri: `${uri}${id}`,
    headers: {
      Authorization: `Bot ${tokenAPI}`,
    },
    json: true,
  };
  rp(request)
    .then((user) => {
      console.log(user);
      // TODO: Create image endingfinder
      // let avatar = `https://cdn.discordapp.com/avatars/172031697355800577/a_6c8c60b9e5def254160f249bb195c605.gif`;
      let embed = new RichEmbed()
        .setAuthor(`Usertag: ${user.username}#${user.discriminator}`)
        .setColor(message.member.displayColor)
        // .setThumbnail(member.user.displayAvatarURL)
        .setFooter(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp();
      message.channel.send({ embed });
    });
};

module.exports.help = {
  name: 'userapi',
};
