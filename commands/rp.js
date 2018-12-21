const servers = require('../config/servers.json');

const fs = require('fs');

let RPChannelArchive;
let RPChannelLog;
let RPChannelCategory;

if (fs.existsSync('./config/test_token.json')) {
  RPChannelArchive = servers.RPChannelArchive_testing;
  RPChannelLog = servers.RPChannelLog_testing;
  RPChannelCategory = servers.RPChannelCategory_testing;
} else {
  RPChannelArchive = servers.RPChannelArchive_main;
  RPChannelLog = servers.RPChannelLog_main;
  RPChannelCategory = servers.RPChannelCategory_main;
}

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
          message.channel.send('Sorry, you are not allowed to remove users from this room!');
        }
      });
      return;

    case 'end':
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}' AND channelID = '${message.channel.id}'`, async (err, rows) => {
        if (err) throw err;

        if (rows[0] || message.member.roles.find('name', config.adminRole)) {
          message.channel.setParent(RPChannelArchive);
        } else {
          message.channel.send('Sorry, you are not allowed to end the RP in this room!');
        }
      });
      return;

    // needs propper introductions
    // case 'help':
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

    case 'info':
      con.query(`SELECT * FROM rp_owner WHERE channelID = '${message.channel.id}'`, (err, rows) => {
        if (err) throw err;
        let owner;
        if (rows[0]) {
          owner = rows[0].ownerID;
        } else {
          owner = 'no one specified';
        }
        message.channel.send({
          embed: {
            color: message.member.displayColor,
            title: 'Channel information',
            fields: [
              {
                name: 'Channelname',
                value: message.channel.name,
                inline: true,
              },
              {
                name: 'Channel ID',
                value: message.channel.id,
                inline: true,
              },
              {
                name: 'Owner',
                value: `<@${owner}>`,
                inline: true,
              },
              // cant, needs to be in DB first
              // {
              //   name: 'Channeltype',
              //   value: message.channel.id,
              //   inline: true,
              // },
              // {
              //   name: 'Channel open?',
              //   value: message.channel.id,
              //   inline: true,
              // },
              // {
              //   name: 'Access to channel',
              //   value: message.channel.id,
              //   inline: true,
              // },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: message.client.user.displayAvatarURL,
              text: message.client.user.tag,
            },
          },
        });
      });
      return;

    case 'reopen':
      if (!message.member.roles.get(config.team)) {
        message.channel.send('Sorry, but you can\'t reopen a channel. Please contact the team if you wish this channel reopened.');
        return;
      }
      message.channel.setParent(RPChannelCategory);
      message.channel.send('This channel has been reopned. Don\'t forget to give the owner of the channel it\'s rights back.');
      client.channels.get(RPChannelLog).send(`The channel <#${message.channel.id}> (${message.channel.id}) got reopened!`);
      return;

    default:
      client.functions.get('invalid_cmd').run(message, subcmd)
        .catch(console.log);
      return;
  }
};

module.exports.help = {
  name: 'rp',
};
