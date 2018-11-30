const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  let [subcmd, name] = args;

  switch (subcmd) {
    case 'create':
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}'`, async (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
          message.channel.send('You already own a RP-Room!');
          message.react('❌');
          return;
        }

        if (!name) {
          message.channel.send('Please provide a name!');
          message.react('❌');
          return;
        }

        if (message.guild.channels.find('name', name)) {
          message.channel.send('Sorry, this channel exists already with the same name.');
          message.react('❌');
          return;
        }

        // disabled for testing
        // con.query(`INSERT INTO rp_owner (ownerID, channelID) VALUES ('${message.author.id}', '${channel.id}')`);

        const channel = await message.guild.createChannel(name, 'text', [{
          id: message.guild.id,
          deny: ['SEND_MESSAGES'],
        }])
          .then(channel => channel.setParent(config.parentRP))
          .then(channel => channel.lockPermissions())
          .then(channel => channel.overwritePermissions(message.author, { SEND_MESSAGES: true }))
          .catch(console.log);

        client.functions.get('usersetup_rp_channel').run(channel, message)
          .catch(console.log);

        // explain what cmds there are + timer
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
          message.channel.send('Sorry, you are not allowed to remove someone from this room!');
        }
      });
      return;

    case 'end':
      // checking if user is owner of channel
      // save channel to archive
      return;

    // case 'help':
    // // wip
    //   message.channel.send({
    //     embed: {
    //       color: message.member.displayColor,
    //       title: 'Help for the RP command',
    //       description: `Usage: \`${config.prefix}rp SUBCMD TYPE NAME\``,
    //       fields: [{
    //         name: 'SUBCMD',
    //         value: 'add: ',
    //       },
    //       {
    //         name: 'NAME',
    //         value: 'Tell me what your room should be called and I\'ll make it happen.',
    //       },
    //       ],
    //       timestamp: new Date(),
    //       footer: {
    //         icon_url: message.client.user.displayAvatarURL,
    //         text: message.client.user.tag,
    //       },
      //   },
      // });
      // return;

    default:
      client.functions.get('invalid_cmd').run(message, subcmd)
        .catch(console.log);
      return;
  }
};

module.exports.help = {
  name: 'rpn',
};
