const fs = require('fs');

const toTime = require('pretty-ms');

const { RichEmbed } = require('discord.js');

const servers = require('../config/servers.json');

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
  const teamCheck = message.member.roles.find((role) => role.id === config.adminRole);

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

        if (message.guild.channels.find((channel) => channel.name === name)) {
          message.channel.send('Sorry, a channel with the same name exists already.');
          message.react('❌');
          return;
        }

        const channel = await message.guild.createChannel(args.join('_').slice(subcmd.length + 1), 'text')
          .then((channel) => channel.setParent(config.parentRP))
          .then((channel) => channel.lockPermissions())
          .then((channel) => channel.overwritePermissions(message.author, { SEND_MESSAGES: true }))
          .catch(console.log);

        message.channel.send(`Your RP channel (<#${channel.id}>) got created! Have fun :3`);

        con.query(`INSERT INTO rp_owner (ownerID, channelID) VALUES ('${message.author.id}', '${channel.id}')`);
        client.functions.get('usersetup_rp_channel').run('Intro', channel, message);

        // client.functions.get('usersetup_rp_channel').run(channel, message)
        //   .catch(console.log);
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

        if (rows[0] || teamCheck) {
          let user = message.mentions.users.first() || message.guild.members.get(args[1]);
          await message.channel.overwritePermissions(
            user.id,
            { SEND_MESSAGES: true },
          );
          message.channel.send(`The user <@${user.id}> got added to this RP room.`);
        } else {
          message.channel.send('Sorry you are not allowed to add someone to this room!');
        }
      });
      return;

    case 'remove':
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}' AND channelID = '${message.channel.id}'`, async (err, rows) => {
        if (err) throw err;

        if (rows[0] || teamCheck) {
          let user = message.mentions.users.first() || message.guild.members.get(args[1]);
          await message.channel.overwritePermissions(
            user.id,
            {
              SEND_MESSAGES: null,
            },
          );
          message.channel.send(`The user <@${user.id}> got removed from this RP room.`);
        } else {
          message.reply('you are not allowed to remove users from this room!');
        }
      });
      return;

    case 'end':
      con.query(`SELECT * FROM rp_owner WHERE ownerID = '${message.author.id}' AND channelID = '${message.channel.id}'`, async (err, rows) => {
        if (err) throw err;

        if (rows[0] || message.member.roles.find((role) => role.name === config.teamRole)) {
          if (message.channel.parentID === RPChannelCategory) {
            message.channel.setParent(RPChannelArchive)
              .then((channel) => channel.lockPermissions());
            message.channel.send('This channel got moved to **archived rooms** because it got ended by the owner of the room!\nIf needed the team can reopen this channel within that time with `=rp reopen`.\nIt might takes 5 additional minutes before you can create a new channel.');
          } else {
            message.reply('you are not allowed to end the RP in this room!');
          }
        } else {
          message.reply('you are not allowed to end the RP in this room!');
        }
      });
      return;

    case 'help':
      let embed = new RichEmbed()
        .setTitle('Help for the RP command')
        .setColor(message.member.displayColor)
        .setDescription(`Usage: \`${config.prefix}rp SUBCMD ARGUMENT\``)
        .addField(
          `\`${config.prefix}rp create NAME\``,
          'Adds a room; One active room per user.', true,
        )
        .addField(
          `\`${config.prefix}rp add USERMENTION\``,
          'Adds writing permissions for a user in your room; owner only', true,
        )
        .addField(
          `\`${config.prefix}rp remove USERMENTION\``,
          'Removes writing permissions of a user in your room; owner only', true,
        )
        .addField(
          `\`${config.prefix}rp help\``,
          'Guess what it does...', true,
        )
        .addField(
          `\`${config.prefix}rp info\``,
          'Shows information from the current channel', true,
        )
        .addField(
          `\`${config.prefix}rp settings\``,
          'Reposts the settings; owner only', true,
        )
        .addField(
          `\`${config.prefix}rp end\``,
          'Ends the RP and archives the room; owner only', true,
        )
        .addField(
          `\`${config.prefix}rp reopen\``,
          'Reopens an archived channel; team only', true,
        )
        .setFooter(message.client.user.tag, message.client.user.displayAvatarURL)
        .setTimestamp();
      message.channel.send({ embed });
      return;

    case 'info':
    // FIXME: Remove cmd from adding time
      con.query(`SELECT * FROM rp_owner WHERE channelID = '${message.channel.id}'`, (err, rows) => {
        if (err) throw err;
        let owner;
        if (rows[0]) {
          owner = rows[0].ownerID;
        } else {
          owner = 'no one specified';
        }
        con.query(`SELECT * FROM rp_timer WHERE id = '${message.channel.id}'`, (err, rows) => {
          let time;
          if (rows[0]) {
            time = toTime(parseInt(rows[0].timeLeft, 10));
          } else {
            time = 'no time specified';
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
                {
                  name: 'Time Left',
                  value: time,
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
      });
      return;

    case 'reopen':
      if (message.member.roles.get(config.team)) {
        if (message.channel.parentID === RPChannelArchive) {
          message.channel.setParent(RPChannelCategory)
            .then((channel) => channel.lockPermissions());
          message.channel.send('This channel has been reopned. Don\'t forget to give the owner of the channel it\'s rights back and set the following setting(s).');
          client.channels.get(RPChannelLog).send(`The channel <#${message.channel.id}> (${message.channel.id}) got reopened!`);
          client.functions.get('usersetup_rp_channel').run('noIntro', message.channel, message)
            .catch(console.log);
        } else {
          message.reply('it doesn\'t seem like it that this channel is archived.');
        }
      } else {
        message.reply('you can\'t reopen a channel. Please contact the team if you wish this channel reopened.');
      }
      return;

    case 'settings':
      // const channel = message.channel;
      client.functions.get('usersetup_rp_channel').run('noIntro', message.channel, message)
        .catch(console.log);
      return;

    case 'delete':
      if (teamCheck) {
        if (message.channel.parentID === RPChannelArchive) {
          con.query(`DELETE FROM rp_timer WHERE id = '${message.channel.id}'`);
          await message.channel.delete();
        } else {
          message.channel.send('This channel hasn\'t been archived yet.');
        }
      } else {
        message.channel.send('This is a CMD for the admins only.');
      }
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
