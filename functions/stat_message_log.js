const toTime = require('pretty-ms');

module.exports.run = async (client, config, con, fs) => {
  if (fs.existsSync('./config/test_token.json')) return;
  con.query('SELECT * FROM stat_offline WHERE entry = \'1\'', async (err, rows) => {
    if (err) throw err;
    const embed = {
      title: 'Bot back online!',
      fields: [{
        name: 'The time the bot was offline:',
        value: `${toTime(rows[0].time * 1)}`,
      },
      ],
      color: 4296754,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.displayAvatarURL,
        text: client.user.tag,
      },
    };
    client.channels.get(config.logReactions).send({ embed });
  });

  // create new entry db entry
  con.query('UPDATE stat_offline SET time = \'0\' WHERE entry = \'1\'');

  setInterval(() => {
    // loop db update in 5 sec intervall
    con.query('SELECT * FROM stat_offline WHERE entry = \'1\'', async (err, rows) => {
      if (err) throw err;
      if (rows[0]) {
        const carc = rows[0].time * 1 + 5000;
        con.query(`UPDATE stat_offline SET time = '${carc}' WHERE entry = '1'`);
      } else {
        console.log('Something went wrong while sending statupdate: It wasn\'t found!');
      }
    });
  }, 1 * 5000);
};

module.exports.help = {
  name: 'stat_message_log',
};
