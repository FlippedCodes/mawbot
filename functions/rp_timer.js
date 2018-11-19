/* eslint-disable no-else-return */
module.exports.run = async (client, servers, fs, con) => {
  let server;
  let server_RPChannelCategory;

  if (fs.existsSync('./config/test_token.json')) {
    server = servers.testing;
    server_RPChannelCategory = servers.RPChannelCategory_testing;
    // return;
  } else {
    server = servers.main;
    server_RPChannelCategory = servers.RPChannelCategory_main;
  }

  // Check if channel is blacklisted
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
      });

      con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
          // remove 5 mins from db (get time, remove, reset.. maybe other solution?)
          // update channel description with propper formating
        } else {
          con.query(`INSERT INTO rp_timer (channelID, timeLeft) VALUES ('${channel.id}', '${servers.RPChannelTime}')`);
          // update channel description with propper formating
        }
      });

      // test if some time left
      // warn user

      // test if time is up
      con.query(`SELECT * FROM rp_timer WHERE id = '${channel.id}'`, (err, rows) => {
        if (err) throw err;
        // remove channel rights, only readable
        // move channel to deactivated rooms
        // write in channel that timer run out
        // (add reaction for team to activate channel again)
      });
      console.log('checkmate!');
      // ^remove in final verstion!
    });
  }, 1 * 300000);
};

module.exports.help = {
  name: 'rp_timer',
};

