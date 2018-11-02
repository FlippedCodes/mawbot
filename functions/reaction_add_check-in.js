module.exports.run = async (user, reaction, config, client) => {
  reaction.message.guild.fetchMember(user)
    .then(async (member) => {
      if (!member.roles.get(config.team)) {
        reaction.remove(user);
        reaction.message.channel.send('Sorry, but you cant check-in yourself or other people!\nPlease wait for a Teammember to check you in.');
        return;
      }
      reaction.message.member.addRole(config.checkinRole);
      await reaction.message.channel.bulkDelete(100);
      await client.channels.get(config.checkin_channelID).send('Have a read of <#496948681656893440>, then ask to be checked in here ^^\n\n(Channel is cleared after every new member)');
      await client.channels.get(config.general).send(`${reaction.message.author}, you are checked-in now! Have a great time on the server! :3`);
      client.channels.get(config.checkin_channelID).send(`Checked \`${reaction.message.author.tag}\` in`)
        .then(msg2 => msg2.delete(4000));
    });
};

module.exports.help = {
  name: 'reaction_add_check-in',
};
