module.exports.run = async (client, message, args, config, functions, RichEmbed, messageOwner) => {
  let embed = new RichEmbed()
    .setAuthor('How to use me:')
    .setColor(message.member.displayColor)
    .addField('E621', `
      ${config.prefix}e6 AMMOUNT TAGS
      You can requwest up to 10 pictures at the twime.
      `)
    .addField('FurAffinity', `
      ${config.prefix}fa SEARCH
      You can currently only requwest SFW pictures. NSFW is in the making.
      `)
    .addField('About', `
      ${config.prefix}about
      Learn mowre about me.
      `)
    .addField('Need Help?', `
      I've got you covered.
      Join the help server here: https://discord.gg/fMYD6XR
      `)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'help',
};
