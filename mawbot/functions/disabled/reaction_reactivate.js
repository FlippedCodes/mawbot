module.exports.run = async (config, client, reaction, RPChannelLog, user, RPChannelCategory) => {
  reaction.message.guild.fetchMember(user)
    .then(async (member) => {
      if (!member.roles.get(config.team)) {
        reaction.message.channel.send('Sorry, but you can\'t reactivate a channel. Please contact the team if you wish this channel reactivated.');
        return;
      }
      reaction.message.channel.setParent(RPChannelCategory);
      reaction.message.channel.send('This channel has been reopned. Don\'t forget to give the owner of the channel it\'s rights back.');
      client.channels.get(RPChannelLog).send(`The channel <#${reaction.message.channel.id}> (${reaction.message.channel.id}) got reopened!`);
    });
  await reaction.remove(user);
};

module.exports.help = {
  name: 'reaction_reactivate',
};
