const Discord = module.require('discord.js');

const client = new Discord.Client();

const fs = require('fs');

let token;

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.adminRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));
  let secret = process.env.BOT_TOKEN;
  if (fs.existsSync('../config/test_token.json')) {
    // token = require('../config/test_token.json');

  }
  message.channel.send('Relogging...')
    .then(() => console.log('Relogging... Bot should be avalable again in a few seconds...'))
    .then(() => client.destroy())
    .then(() => console.log('Login...'))
    .then(() => client.login(secret))
    .then(() => console.log('Relog done!'))
    .then(() => message.channel.send('Relogged!'));
};


module.exports.help = {
  name: 'relog',
};
