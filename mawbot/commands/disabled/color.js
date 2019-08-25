module.exports.run = async (client, message, args, con, config) => {
  const pride = message.guild.roles.find(role => role.name === 'pride');
  setInterval(() => {
    pride.setColor('#FF0035')
      .catch(console.error);
    setTimeout(() => {
      pride.setColor('#4B0082')
        .catch(console.error);
    }, 1100);
    setTimeout(() => {
      pride.setColor('#0000FF')
        .catch(console.error);
    }, 1100);
    setTimeout(() => {
      pride.setColor('#00FF00')
        .catch(console.error);
    }, 1100);
    setTimeout(() => {
      pride.setColor('#FFFF00')
        .catch(console.error);
    }, 1100);
    setTimeout(() => {
      pride.setColor('#FF7F00')
        .catch(console.error);
    }, 1100);
    setTimeout(() => {
      pride.setColor('#FF0000')
        .catch(console.error);
    }, 1100);
  }, 900);
};

module.exports.help = {
  name: 'color',
};
