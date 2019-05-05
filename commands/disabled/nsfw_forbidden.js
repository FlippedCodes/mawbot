const toTime = require('pretty-ms');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.name === config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  const target = message.mentions.members.first() || message.guild.members.get(args[0]);
  con.query(`SELECT * FROM custom_roles_userage WHERE userID = '${target.id}'`, (err, rows) => {
    if (err) throw err;
    if (rows.length < 1) {
      message.channel.send(`You added \`${target.user.tag}\` to the blacklist and isn't allowed to assign no_nsfw or nsfl_access anymore.`);
      target.removeRoles(config.NSFL)
        .catch(console.log);
      target.addRole(config.noNSFW)
        .catch(console.log);
    } else {
      con.query(`INSERT INTO custom_roles_userage (userID, userAge, submitted, changed, allowed) VALUE ('${target.id}', 'none', '${Date.now()}', '${Date.now()}', '1')`);
      message.channel.send(`\`${target.user.tag}\` was not in the agelist.\n They got added now with the age of 'none' and no access to the 18+ rooms.`);
      message.react('❌');
    }
  });
};

module.exports.help = {
  name: 'nsfw_forbidden',
};
