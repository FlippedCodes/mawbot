const version = require('../package.json');

const fs = require('fs');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.name === config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the Devs can use this~`).then(message.react('❌'));

  fs.readFile('./config/changelog.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      message.react('❌');
      return;
    }
    message.channel.send(`My current maw-version is \`${version.version}\``);
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'changelog',
};

