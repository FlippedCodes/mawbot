const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find('name', config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the Devs can use this~`).then(message.react('❌'));

  const member = await message.mentions.members.first() || message.guild.members.get(args[0]);

  await member.removeRoles(member.roles);
  await member.addRole(config.mutedRole);
  const fetchchannel = await message.guild.channels.get(config.logChannel);

  con.query(`SELECT * FROM muted_user WHERE id = '${member.id}'`, (err, rows) => {
    if (err) throw err;
    if (rows.length < 1) {
      con.query(`INSERT INTO muted_user (id) VALUE ('${member.id}')`);
    }
  });

  message.react('✅');
  await fetchchannel.send(`<@${message.author.id}> Muted User ${member.id} (${member.user.tag} | ${member.user.username})`);
};

module.exports.help = {
  name: 'mute',
};
