const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  let [subcmd, type, name] = args;

  switch (subcmd) {
    case 'create':
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}'`, async (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
          message.channel.send('You already own a RP-Room!');
          message.react('❌');
          return;
        }
        if (message.guild.channels.find('name', name)) {
          message.channel.send('Sorry, this channel exists already with the same name.');
          message.react('❌');
          return;
        }

        const channel = await message.guild.createChannel(name, 'text', [{
          id: message.guild.id,
          deny: ['SEND_MESSAGES'],
        }])
          .then(channel => channel.setParent('455027708838150154'))
          .then(channel => channel.overwritePermissions(
            message.author,
            {
              SEND_MESSAGES: true,
            },
            config.clientID,
            {
              SEND_MESSAGES: true,
            },
            config.mutedRole,
            {
              VIEW_CHANNEL: false,
            },
            config.team,
            {
              SEND_MESSAGES: true,
            },
          ).catch(console.log));

        con.query(`INSERT INTO rp_owner (ownerID, channelID) VALUES ('${message.author.id}', '${channel.id}')`);

        await channel.send(`<@${message.author.id}> \nYour rp channel is ready! Have fun!`);
        message.react('✅');
      });
      // somewhere we need a description setter for the inactive timer
      // should read "Channel created by OWNER and gets deleted in DD:HH:MM"
      // time reader, time setter and timer should be in index.js bc this is not getting run in here
      return;

    case 'add':
      // testfor channlerights is unnasesary because the user already has channel rights to write in it
      // would be easyer to test if the channel is in the category because of not using it in generag for example
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}' AND channelID = '${message.channel.id}'`, async (err, rows) => {
        if (err) throw err;

        if (rows[0] || message.member.roles.find('name', config.adminRole)) {
          let user = message.mentions.users.first() || message.guild.members.get(args[1]);
          await message.channel.overwritePermissions(
            user.id,
            {
              SEND_MESSAGES: true,
            },
          );
        } else {
          message.channel.send('Sorry you are not allowed to add someone to this room!');
        }
      });
      return;

    case 'remove':
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}' AND channelID = '${message.channel.id}'`, async (err, rows) => {
        if (err) throw err;

        if (rows[0] || message.member.roles.find('name', config.adminRole)) {
          let user = message.mentions.users.first() || message.guild.members.get(args[1]);
          await message.channel.overwritePermissions(
            user.id,
            {
              SEND_MESSAGES: false,
            },
          );
        } else {
          message.channel.send('Sorry you are not allowed to remove someone from this room!');
        }
      });
      return;

    case 'end':
      // test if the channel is in the category because of not using it in general for example
      // also maybe saving it up for 24hrs. it should extand the timer to that
      message.channel.delete()
        .then(console.log)
        .catch(console.error);
      return;

    default:
      message.channel.send(`Sorry dont know what you ment with \`${subcmd}\`...`);
      // different awnerst every time? would be nice
      // Inavid comamnd \`${subcmd}\` 💩
      // Sorry I dont know this command \`${subcmd}\`
      // Eh? Do you speak my languane? Because me dont know \`${subcmd}\`...
      // but this can wait
      return;
  }
};

module.exports.help = {
  name: 'rp',
};
