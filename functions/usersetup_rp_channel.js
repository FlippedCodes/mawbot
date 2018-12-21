module.exports.run = async (channel, message) => {
  channel.send(`<@${message.author.id}> \nYour rp channel is now created! Please use \`=rp info\` for more information and the currenty status of your chatroom`);
  channel.send('This is the setup guide for your channel, please click the reactions to the questions.');
  channel.send('Do you want a private room or a public room where everyone can write in?')
    .then((msg) => {
      msg.react('🚪');
      msg.react('🔓');
    });
  channel.send('What type of room would you prefer? Make sure you have the propper roles form \n🔅  SFW\n🔞  NSFW\n☠  NSFL')
    .then((msg) => {
      msg.react('🔅');
      msg.react('🔞');
      msg.react('☠');
    });
};

module.exports.help = {
  name: 'usersetup_rp_channel',
};
