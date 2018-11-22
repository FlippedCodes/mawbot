/* eslint-disable no-else-return */

const toMs = require('pretty-ms');

module.exports.run = async (client, servers, fs, con) => {
  let server;
  let RPChannelCategory;
  let RPChannelArchive;
  let RPChannelLog;

  if (fs.existsSync('./config/test_token.json')) {
    server = servers.testing;
    RPChannelCategory = servers.RPChannelCategory_testing;
    RPChannelArchive = servers.RPChannelArchive_testing;
    RPChannelLog = servers.RPChannelLog_testing;
    // return;
  } else {
    server = servers.main;
    RPChannelCategory = servers.RPChannelCategory_main;
    RPChannelArchive = servers.RPChannelArchive_main;
    RPChannelLog = servers.RPChannelLog_main;
  }

  setInterval(() => {
    client.guilds.get(server).channels.get(RPChannelCategory).children.forEach((channel) => {
      con.query(`SELECT * FROM rp_timerBlacklist WHERE id = '${channel.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) return channel.setTopic('This channel is blacklisted and won\'t be effacted from the timeout.');

        con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}'`, (err, rows) => {
          if (err) throw err;
          if (rows[0]) {
            const carc = rows[0].timeLeft - 300000;
            channel.setTopic(`active: ${toMs(carc)} left, before this channel gets archived!`);
            con.query(`UPDATE rp_timer SET timeLeft = '${carc}' WHERE id = '${channel.id}' AND timeLeft = '${rows[0].timeLeft}'`);

            if (rows[0].timeLeft <= servers.RPChannelTimeWarn && rows[0].warned === 'f') {
              con.query(`UPDATE rp_timer SET warned = 't' WHERE id = '${channel.id}' AND warned = 'f'`);
              con.query(`SELECT * FROM rp_owner WHERE channelID = '${channel.id}'`, async (suberr, user) => {
                if (suberr) throw suberr;
                // NEEDS FIX: user is undefined
                // await channel.send(`<@${user.ownerID}>, Your Channel gets deactivated in the next ${toMs(parseInt(rows[0].timeLeft, 10))}!`);
                await channel.send(`This Channel gets deactivated in the next ${toMs(parseInt(rows[0].timeLeft, 10))}!`);
              });
            }

            if (rows[0].timeLeft <= 0) {
              channel.setParent(RPChannelArchive);
              // remove channel rights, only readable (bot needs writeing rights!)
              channel.send(`The time has run out and this channel got now archived! It will be open for the next ${toMs(servers.PRChannelArchivedTime)} before complete deletion.`);
              // add reaction for team to activate channel again
              // log archived
            }
          } else {
            con.query(`INSERT INTO rp_timer (id, timeLeft, warned) VALUES ('${channel.id}', '${servers.RPChannelTime}', 'f')`);
            channel.setTopic(`active: ${toMs(servers.RPChannelTime)} left, before this channel gets archived!`);
          }
        });
      });
    });

    client.guilds.get(server).channels.get(RPChannelArchive).children.forEach((channel) => {
      con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
          const carc = rows[0].timeLeft - 300000;
          channel.setTopic(`archived: ${toMs(carc)} left, before deletion!`);
          con.query(`UPDATE rp_timer SET timeLeft = '${carc}' WHERE id = '${channel.id}' AND timeLeft = '${rows[0].timeLeft}'`);

          if (rows[0].timeLeft <= 0) {
            client.guilds.get(server).channels.get(RPChannelLog).send(`${channel.id} (${channel.name}) got deleted, because tis older than a month!`);
            con.query(`DELETE FROM rp_timer WHERE id = '${channel.id}'`);
            channel.delete();
          }
        } else {
          con.query(`INSERT INTO rp_timer (id, timeLeft, warned) VALUES ('${channel.id}', '${servers.PRChannelArchivedTime}', 't')`);
          channel.setTopic(`archived: ${toMs(servers.RPChannelTime)} left, before deletion!`);
        }
      });
    });
  }, 1 * 5000);
  // }, 1 * 300000);
  // change after testing to 5 mins
};

module.exports.help = {
  name: 'rp_timer',
};

