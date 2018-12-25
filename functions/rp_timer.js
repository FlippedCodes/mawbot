const toTime = require('pretty-ms');

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
        if (rows[0]) return channel.setTopic('This channel won\'t be effacted from the timeout.');

        con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}' AND archived = 'f'`, async (err, rows) => {
          if (err) throw err;
          if (rows[0]) {
            if (rows[0].timeLeft <= servers.RPChannelTimeWarn && rows[0].warned === 'f') {
              con.query(`UPDATE rp_timer SET warned = 't' WHERE id = '${channel.id}' AND warned = 'f'`);
              con.query(`SELECT * FROM rp_owner WHERE channelID = '${channel.id}'`, async (suberr, user) => {
                if (suberr) throw suberr;
                // NEEDS FIX: user is undefined
                // await channel.send(`<@${user.ownerID}>, Your Channel gets deactivated in the next ${toTime(parseInt(rows[0].timeLeft, 10))}!`);
                await channel.send(`This Channel gets deactivated in the next ${toTime(parseInt(rows[0].timeLeft, 10))}!`);
              });
            }

            if (rows[0].timeLeft <= 0) {
              con.query(`DELETE FROM rp_timer WHERE id = '${channel.id}'`);
              con.query(`DELETE FROM rp_owner WHERE channelID = '${channel.id}'`);
              channel.setParent(RPChannelArchive);
              await channel.send(`The time has run out and this channel got moved to **archived rooms** because it is inactive! It will be archived for the next ${toTime(servers.PRChannelArchivedTime)} before complete deletion.\nIf needed the team can reopen this channel within that time with \`=rp reopen\`.`);
              // remove channel rights, only readable (bot needs writing rights!)
              client.channels.get(RPChannelLog).send(`The channel <#${channel.id}> (${channel.id}) got archived!`);
              channel.setTopic(`🔒 archived: ${toTime(servers.RPChannelTime)} left, before deletion!`);
            }

            const carc = rows[0].timeLeft - 300000;
            channel.setTopic(`🔓 active: ${toTime(carc)} left, before this channel gets archived!`);
            con.query(`UPDATE rp_timer SET timeLeft = '${carc}' WHERE id = '${channel.id}' AND timeLeft = '${rows[0].timeLeft}'`);
          } else {
            con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}' AND archived = 't'`, (err, rows) => {
              if (err) throw err;
              if (rows[0]) {
                con.query(`UPDATE rp_timer SET archived = 'f' WHERE id = '${channel.id}' AND archived = 't'`);
                con.query(`UPDATE rp_timer SET timeLeft = '${servers.RPChannelTime}' WHERE id = '${channel.id}'`);
                con.query(`UPDATE rp_timer SET warned = 'f' WHERE id = '${channel.id}' AND warned = 't'`);
              } else {
                con.query(`INSERT INTO rp_timer (id, timeLeft, warned, archived) VALUES ('${channel.id}', '${servers.RPChannelTime}', 'f', 'f')`);
                channel.setTopic(`🔓 active: ${toTime(servers.RPChannelTime)} left, before this channel gets archived!`);
              }
            });
          }
        });
      });
    });

    client.guilds.get(server).channels.get(RPChannelArchive).children.forEach((channel) => {
      con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}' AND archived = 't'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
          const carc = rows[0].timeLeft - 300000;
          channel.setTopic(`🔒 archived: ${toTime(carc)} left, before deletion!`);
          con.query(`UPDATE rp_timer SET timeLeft = '${carc}' WHERE id = '${channel.id}' AND timeLeft = '${rows[0].timeLeft}'`);

          if (rows[0].timeLeft <= 0) {
            con.query(`DELETE FROM rp_timer WHERE id = '${channel.id}'`);
            client.channels.get(RPChannelLog).send(`The channel <#${channel.id}> (${channel.id}) got deleted, because it is older than a month!`)
              .then(() => channel.delete());
          }
        } else {
          con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}' AND archived = 'f'`, (err, rows) => {
            if (err) throw err;
            if (rows[0]) {
              con.query(`UPDATE rp_timer SET archived = 't' WHERE id = '${channel.id}' AND archived = 'f'`);
              con.query(`UPDATE rp_timer SET timeLeft = '${servers.PRChannelArchivedTime}' WHERE id = '${channel.id}'`);
              con.query(`UPDATE rp_timer SET warned = 't' WHERE id = '${channel.id}' AND warned = 'f'`);
            } else {
              con.query(`INSERT INTO rp_timer (id, timeLeft, warned, archived) VALUES ('${channel.id}', '${servers.PRChannelArchivedTime}', 't', 't')`);
              channel.setTopic(`archived: ${toTime(servers.RPChannelTime)} left, before deletion!`);
              channel.lockPermissions();
            }
          });
        }
      });
    });
  // keep 5 sec intervall for testing
  }, 1 * 5000);
  // }, 1 * 300000);
};

module.exports.help = {
  name: 'rp_timer',
};

