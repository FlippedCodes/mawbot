module.exports.run = async (servers, message) => {
  let config;
  if (message.channel.guild.id === servers.main) {
    config = require('../../config/main/config.json');
  }
  if (message.channel.guild.id === servers.night_dragon) {
    config = require('../../config/night_dragon/config.json');
  }
  if (message.channel.guild.id === servers.voretv) {
    config = require('../../config/voretv/config.json');
  }
  if (message.channel.guild.id === servers.testing) {
    config = require('../../config/testing/config.json');
  }
  return;
};

module.exports.help = {
  name: 'config',
};
