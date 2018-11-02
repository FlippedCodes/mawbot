module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find('name', config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  const target = message.mentions.members.first() || message.guild.members.get(args[0]);
  con.query(`SELECT * FROM custom_roles_ban WHERE id = '${target.id}'`, (err, rows) => {
    if (err) throw err;

    if (rows.length < 1) {
      con.query(`INSERT INTO custom_roles_ban (id) VALUE ('${target.id}')`);
      message.channel.send(`You added \`${target.user.tag}\` to the blacklist and isnt allowed to assign no_nsfw or nsfl_access anymore.\nYou should remove any access to this channels by hand`);
    } else {
      message.channel.send(`\`${target.user.tag}\` is already on this blacklist`);
      message.react('❌');
    }
  });
};

module.exports.help = {
  name: 'nsfw_forbidden',
};
