module.exports.run = async (client, message, args, con, config) => {
  if (!message.channel.nsfw) return message.channel.send('This channel is not NSFW, please use a different channel!');

  // asdf
};

module.exports.help = {
  name: 'e6',
};
