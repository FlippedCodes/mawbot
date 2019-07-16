module.exports.run = async (emoji, user, reaction, config, client, Discord) => {
  reaction.message.guild.fetchMember(user)
    .then(async (member) => {
      if (!member.roles.get(config.team)) {
        reaction.remove(user);
        reaction.message.channel.send('Sorry, but you can\'t check-in yourself or other people!\nPlease wait for a Teammember to check you in.');
        return;
      }
      let embed;
      switch (emoji) {
        case '👌':
          embed = new Discord.RichEmbed()
            .setDescription('Have a read of <#496948681656893440>, then ask to be checked in here ^^\n\n(Channel is cleared after every new member)');
          reaction.message.member.addRole(config.checkinRole);
          await reaction.message.channel.bulkDelete(100);
          await client.channels.get(config.checkin_channelID).send({ embed });
          await client.channels.get(config.general).send(`${reaction.message.author}, you are checked-in now! Have a great time on the server! :3`);
          client.channels.get(config.checkin_channelID).send(`Checked \`${reaction.message.author.tag}\` in`)
            .then(msg2 => msg2.delete(4000));
          return;

        case '✋':
          embed = new Discord.RichEmbed()
            .setDescription('Have a read of <#496948681656893440>, then ask to be checked in here ^^\n\n(Channel is cleared after every new member)');
          await reaction.message.author.send('It seems like your check-in got declined. Please get in touch with the team.');
          await reaction.message.channel.bulkDelete(100);
          await client.channels.get(config.checkin_channelID).send({ embed });
          client.channels.get(config.checkin_channelID).send(`Rejected \`${reaction.message.author.tag}\` to be checked-in`)
            .then(msg2 => msg2.delete(4000));
          return;

          // case '⛔':
          //   reaction.message.member.addRole(config.checkinRole);
          //   await reaction.message.channel.bulkDelete(100);
          //   await client.channels.get(config.checkin_channelID).send('Have a read of <#496948681656893440>, then ask to be checked in here ^^\n\n(Channel is cleared after every new member)');
          //   await client.channels.get(config.general).send(`${reaction.message.author}, you are checked-in now! Have a great time on the server! :3`);
          //   client.channels.get(config.checkin_channelID).send(`Blocked \`${reaction.message.author.tag}\` from checking in - please review the user and ckeck in manually`)
          //     .then(msg2 => msg2.delete(4000));
          //   return;

        default:
          return;
      }
    });
};

module.exports.help = {
  name: 'reaction_add_check-in',
};
