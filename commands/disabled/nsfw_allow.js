module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.name === config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  const target = message.mentions.members.first() || message.guild.members.get(args[0]);
  con.query(`SELECT * FROM custom_roles_userage WHERE userID = '${target.id}'`, (err, rows) => {
    if (err) throw err;

    if (!rows.length < 1) {
      con.query(`DELETE FROM custom_roles_userage WHERE userID = '${target.id}'`);
      message.channel.send(`\`${target.user.tag}\` now has access to assign no_nsfw or nsfl_access.`);
    } else {
      message.channel.send(`\`${target.user.tag}\` already has access to no_nsfw and nsfl_access!`);
      message.react('❌');
    }
  });
};
module.exports.help = {
  name: 'nsfw_allow',
};
