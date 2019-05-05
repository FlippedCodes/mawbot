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

        if (!type === 'sfw' || !type === 'nsfw' || !type === 'nsfl' || type === '') return message.channel.send('Please provide a channeltype.');

        if (!name) return message.channel.send('Please provide a channelname.');

        if (message.guild.channels.find(channel => channel.name === name)) {
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

        if (rows[0] || message.member.roles.find(role => role.name === config.adminRole)) {
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

        if (rows[0] || message.member.roles.find(role => role.name === config.adminRole)) {
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
      // test if the channel is in the category because of not using it in general for example
      // also maybe saving it up for 24hrs. it should extand the timer to that
      message.channel.delete()
        .then(console.log)
        .catch(console.error);
      return;

    case 'help':
      message.channel.send({
        embed: {
          color: message.member.displayColor,
          title: 'Help for the RP command',
          description: `Usage: \`${config.prefix}rp SUBCMD TYPE NAME\``,
          fields: [{
            name: 'SUBCMD',
            value: 'add: ',
          },
          {
            name: 'TYPE',
            value: 'You can choose the type of RP you are having from `SFW`, `NSFW` or `NSFL`.',
          },
          {
            name: 'NAME',
            value: 'Tell me what your room should be called and I\'ll make it happen.',
          },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.client.user.displayAvatarURL,
            text: message.client.user.tag,
          },
        },
      });
      return;

    default:
      const confusResponses = [
        'You... what, now?',
        'Pardon me?',
        'Hah, yeah... what?',
        `Sorry, I have no idea what \`${subcmd}\` means.`,
        'Come again?',
        'Maybe you should try something else there, buddy.',
        `I tried to understand \`${subcmd}\`, trust me, but I just cannot.`,
        `💩 Invalid comamnd \`${subcmd}\``,
        `Sorry, I don't know this command -  \`${subcmd}\``,
        `Eh? Do you speak my language? Because I don't know \`${subcmd}\`...`,
      ];

      const randomChoice = Math.floor(Math.random() * confusResponses.length);
      message.channel.send(confusResponses[randomChoice]);
      return;
  }
};

module.exports.help = {
  name: 'rp_old',
};
