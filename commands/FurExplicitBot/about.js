const fs = require('fs');

module.exports.run = async (client, message, args, config, functions, RichEmbed) => {
  fs.readFile('./config/furaffinity/about.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      message.react('❌');
      return;
    }
    message.channel.send(data);
  });
};

module.exports.help = {
  name: 'about',
};
