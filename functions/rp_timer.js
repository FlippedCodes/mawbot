/* eslint-disable no-else-return */

const toMs = require('pretty-ms');

module.exports.run = async (client, servers, fs, con) => {
  let server;
  let server_RPChannelCategory;
  let server_RPChannelArchive;

  if (fs.existsSync('./config/test_token.json')) {
    server = servers.testing;
    server_RPChannelCategory = servers.RPChannelCategory_testing;
    server_RPChannelArchive = servers.RPChannelArchive_testing;
    // return;
  } else {
    server = servers.main;
    server_RPChannelCategory = servers.RPChannelCategory_main;
    server_RPChannelArchive = servers.RPChannelArchive_main;
  }

  client.guilds.find('id', server).channels.find('id', server_RPChannelCategory).children.forEach((channel) => {
    con.query(`SELECT * FROM rp_timerBlacklist WHERE id = '${channel.id}'`, (err, rows) => {
      if (err) throw err;
      if (rows[0]) channel.setTopic('This channel is blacklisted and won\'t be effacted from the timeout.');
    });
  });

  setInterval(() => {
    client.guilds.find('id', server).channels.find('id', server_RPChannelCategory).children.forEach((channel) => {
      con.query(`SELECT * FROM rp_timerBlacklist WHERE id = '${channel.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) return;

        con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}'`, (err, rows) => {
          if (err) throw err;
          if (rows[0]) {
            const carc = rows[0].timeLeft - 300000;
            channel.setTopic(toMs(carc));
            con.query(`UPDATE rp_timer SET timeLeft = '${carc}' WHERE id = '${channel.id}' AND timeLeft = '${rows[0].timeLeft}'`);
          } else {
            con.query(`INSERT INTO rp_timer (id, timeLeft, warned) VALUES ('${channel.id}', '${servers.RPChannelTime}', 'f')`);
            channel.setTopic(`${toMs(servers.RPChannelTime)}`);
          }
        });

        con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}' AND warned = 'f'`, (err, rows) => {
          if (err) throw err;
          if (rows[0]) {
            if (rows[0].timeLeft <= servers.RPChannelTimeWarn) {
              con.query(`UPDATE rp_timer SET warned = 't' WHERE id = '${channel.id}' AND warned = 'f'`);
              con.query(`SELECT * FROM rp_owner WHERE channelID = '${channel.id}'`, async (suberr, user) => {
                if (suberr) throw suberr;
                // NEEDS FIX: user is undefined
                // await channel.send(`<@${user.ownerID}>, Your Channel gets deactivated in the next ${toMs(parseInt(rows[0].timeLeft, 10))}!`);
                await channel.send(`This Channel gets deactivated in the next ${toMs(parseInt(rows[0].timeLeft, 10))}!`);
              });
            }
          }
        });

        // test if time is up
        con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}'`, (err, rows) => {
          if (err) throw err;
          if (rows[0]) {
            if (rows[0].timeLeft <= 0) {
              channel.setParent(server_RPChannelArchive);
              // remove channel rights, only readable (bot needs writeing rights!)
              // write in channel that timer run out
              // add reaction for team to activate channel again
              // remove room from db
            }
          }
        });
      });
    });
  }, 1 * 5000);
  // change after testing to 5 mins
};

module.exports.help = {
  name: 'rp_timer',
};

