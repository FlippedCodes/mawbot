const fs = require('fs');

const version = require('../../package.json');

module.exports.run = async (client, message, args, con, config) => {
  fs.readFile('./config/furaffinity/changelog.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      message.react('❌');
      return;
    }
    message.channel.send(`My current version iws \`${version.version}\``);
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'changelog',
};
