module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.name === config.adminRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  message.guild.members.forEach((user) => {
    if (user.user.bot) return;
    if (!user.kickable) return;

    con.query(`SELECT * FROM prune WHERE id = '${user.id}'`, (err, rows) => {
      if (err) throw err;

      if (rows.length < 1) {
        user.user.send('It seems like you were inactive in the last two weeks so you got kicked from the server. But dont worry if you think this was a mistake or you just want to rejoin, please use one of the two links below:\n\nhttps://discord.gg/rKNCT9F\nhttp://thedragonsmaw.tk/')
          .then(() => user.kick()
            .catch(console.error));
        message.channel.send(`\`${user.id}\` (\`${user.user.tag}\`) got kicked!`);
      } else {
        message.channel.send(`\`${user.id}\` (\`${user.user.tag}\`) on Blacklist!`);
      }
    });
  });
};

module.exports.help = {
  name: 'prune',
};
