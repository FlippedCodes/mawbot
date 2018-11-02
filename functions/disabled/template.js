module.exports.run = async (message) => {
  message.channel.send(message.author.username);
};

module.exports.help = {
  name: 'template',
};
