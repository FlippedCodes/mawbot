module.exports.run = async (client, message, args, con, config) => {
  message.channel.send(message.author.username);
};

module.exports.help = {
  name: 'template',
};
