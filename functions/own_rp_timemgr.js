module.exports.run = async (message, con, servers) => {
  con.query(`SELECT * FROM rp_timer WHERE id = '${message.channel.id}' AND archived = 'f'`, async (err, rows) => {
    if (err) throw err;
    if (rows[0]) {
      con.query(`UPDATE rp_timer SET timeLeft = '${servers.RPChannelTime}' WHERE id = '${message.channel.id}'`);
      con.query(`UPDATE rp_timer SET warned = 'f' WHERE id = '${message.channel.id}' AND warned = 't'`);
    }
  });
};

module.exports.help = {
  name: 'own_rp_timemgr',
};
