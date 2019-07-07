module.exports.run = async (client, message, args, con, config) => {
  console.log('__');
  let guild = client.guilds.get('451833819910373406');
  let users = guild.roles.get('451833819910373406').members.map((m) => {
    if (m.roles.size === 1) console.log(m.user.tag);
  });
};

module.exports.help = {
  name: 'test',
};
