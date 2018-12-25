module.exports.run = async (intro, channel, message) => {
  if (intro === 'Intro') {
    channel.send(`<@${message.author.id}> \nYour rp channel is now created! Please use \`=rp info\` for more information and the currenty status of your chatroom`);
    channel.send('This is the setup guide for your channel, please click the reactions to the questions.');
  }
  channel.send('Do you want a private room or a public room where everyone can **write** in?\n🚪  Private\n🔓  Open')
    .then(async (msg) => {
      await msg.react('🚪');
      await msg.react('🔓');
    });
  channel.send('What type of room would you prefer? Make sure you have the propper roles from <#496961294721875969> \n🔅  SFW\n🔞  NSFW\n☠  NSFL')
    .then(async (msg) => {
      await msg.react('🔅');
      await msg.react('🔞');
      await msg.react('☠');
    });
};

module.exports.help = {
  name: 'usersetup_rp_channel',
};
