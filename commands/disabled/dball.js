module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.name === config.adminRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  con.query('SELECT * FROM prune', async (err, rows) => {
    if (err) throw err;

    message.channel.send(rows.map(entry => entry.id).join('\n'))
      .then(() => message.channel.send(`${rows.length} entries`));
  });
};

module.exports.help = {
  name: 'dball',
};
