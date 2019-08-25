module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.adminRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));
  // id not working
  let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  con.query(`SELECT * FROM prune WHERE id = '${target.id}'`, (err, rows) => {
    if (err) throw err;
    if (!rows[0]) {
      message.channel.send(`\`${target.tag}\` is not on the blacklist!`);
    } else {
      message.channel.send(`\`${target.tag}\` (\`${rows[0].id}\`) is  on the blacklist!`);
    }
  });
};

module.exports.help = {
  name: 'db',
};
