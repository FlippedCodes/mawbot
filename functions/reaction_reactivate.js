module.exports.run = async (client, reaction, RPChannelLog, RPChannelCategory) => {
  reaction.message.channel.setParent(RPChannelCategory);
  reaction.message.channel.send('This channel has been reopned. Don\'t forget to give the owner of the channel it\'s rights back.');
  client.channels.get(RPChannelLog).send(`The channel <#${reaction.message.channel.id}> (${reaction.message.channel.id}) got reopened!`);
};

module.exports.help = {
  name: 'reaction_reactivate',
};
