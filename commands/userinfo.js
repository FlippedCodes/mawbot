const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.id === config.team)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));
  // username not working
  const target = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;

  // no-game fallback
  let game = '-';
  if (target.presence.game) game = target.presence.game.name;

  message.guild.fetchMember(target)
    .then((member) => {
      let embed = new RichEmbed()
        .setAuthor(`User: ${member.user.tag}`)
        .setColor(member.displayColor)
        .setThumbnail(member.user.displayAvatarURL)

        .addField('Tag', member.user.tag, true)
        .addField('Nickname', member.displayName, true)
        .addField('ID', member.id, true)
        .addField('Status', member.user.presence.status, true)
        .addField('Is Bot?', member.user.bot, true)
        .addField('Kickable?', member.kickable, true)
        .addField('Bannable?', member.bannable, true)

        .addField(
          'Joined this server',
          `the ${target.joinedAt.toLocaleDateString()}
          at ${target.joinedAt.toLocaleTimeString()}`,
          true,
        )
        .addField(
          'Joined Discord',
          `the ${target.user.createdAt.toLocaleDateString()}
          at ${target.user.createdAt.toLocaleTimeString()}`,
          true,
        )

        .addField('Playing', game, true)

        .addField('VC - muted', member.mute, true)
        .addField('VC - deafened', member.deaf, true)
        .addField('VC - server mute', member.serverMute, true)
        .addField('VC - server deafen', member.serverDeaf, true)
        .addField('VC - is talking?', member.speaking)

        .addField(
          'Roles',
          member.roles.map(roles => roles.name).join('\n'),
          false,
        )

        .setFooter(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp();

      message.channel.send({ embed });
    })
    .catch(console.error);

  // let embed;
  // if (target.lastMessage) {
  //   embed = {
  //     color: target.lastMessage.member.displayColor,
  //     timestamp: new Date(),
  //     footer: {
  //       icon_url: target.client.user.displayAvatarURL,
  //       text: target.client.user.tag,
  //     },
  //     author: {
  //       name: target.tag,
  //     },
  //     fields: [
  //       {
  //         // 0
  //         name: 'Joined TDM-Network',
  //         value: `${target.joinedAt.toLocaleDateString()} ${target.joinedAt.toLocaleTimeString()}`,
  //         inline: true,
  //       },
  //       {
  //         // 1
  //         name: 'Joined Discord',
  //         value: `${target.user.createdAt.toLocaleDateString()} ${target.user.createdAt.toLocaleTimeString()}`,
  //         inline: true,
  //       },
  //       {
  //       // 2
  //         name: 'ID',
  //         value: target.id,
  //         inline: true,
  //       },
  //       {
  //       // 3
  //         name: 'Tag',
  //         value: target.user.tag,
  //         inline: true,
  //       },
  //       {
  //       // 4
  //         name: 'Username',
  //         value: target.user.username,
  //         inline: true,
  //       },
  //       {
  //       // 5
  //         name: 'Is Bot',
  //         value: target.user.bot,
  //         inline: true,
  //       },
  //       {
  //       // 6
  //         name: 'Bannable',
  //         value: target.lastMessage.member.bannable,
  //         inline: true,
  //       },
  //       {
  //       // 7
  //         name: 'Kickable',
  //         value: target.lastMessage.member.kickable,
  //         inline: true,
  //       },
  //       {
  //       // 8
  //         name: 'Server deafen',
  //         value: target.lastMessage.member.serverDeaf,
  //         inline: true,
  //       },
  //       {
  //       // 9
  //         name: 'Server mute',
  //         value: target.lastMessage.member.serverMute,
  //         inline: true,
  //       },
  //       {
  //       // 10
  //         name: 'Deafened',
  //         value: target.lastMessage.member.deaf,
  //         inline: true,
  //       },
  //       {
  //       // 11
  //         name: 'Muted',
  //         value: target.lastMessage.member.mute,
  //         inline: true,
  //       },
  //       {
  //       // 12
  //         name: 'Roles',
  //         value: target.lastMessage.member.roles.map(roles => roles.name).join('\n'),
  //         inline: true,
  //       },
  //       {
  //       // 13
  //         name: 'Status',
  //         value: target.presence.status,
  //         inline: true,
  //       },
  //       {
  //       // 16
  //         name: 'Is playing',
  //         value: game,
  //         inline: true,
  //       },
  //       {
  //       // 14
  //         name: 'Last message',
  //         value: `\`\`\`<${target.lastMessage.createdAt.toLocaleDateString()} ${target.lastMessage.createdAt.toLocaleTimeString()}> ${target.lastMessage.content}\`\`\``,
  //       },
  //       {
  //       // 15
  //         name: 'Is writing',
  //         value: target.lastMessage.member.speaking,
  //         inline: true,
  //       },
  //       {
  //       // 17
  //         name: 'Avatar',
  //         value: target.user.displayAvatarURL,
  //       },
  //     ],
  //     image: {
  //       url: target.user.displayAvatarURL,
  //     },
  //   };
  // } else {
  //   embed = {
  //     timestamp: new Date(),
  //     footer: {
  //       icon_url: target.client.user.displayAvatarURL,
  //       text: target.client.user.tag,
  //     },
  //     author: {
  //       name: target.tag,
  //     },
  //     fields: [
  //       {
  //         // 0
  //         name: 'Joined TDM-Network',
  //         value: `${target.joinedAt.toLocaleDateString()} ${target.joinedAt.toLocaleTimeString()}`,
  //         inline: true,
  //       },
  //       {
  //         // 1
  //         name: 'Joined Discord',
  //         value: `${target.user.createdAt.toLocaleDateString()} ${target.user.createdAt.toLocaleTimeString()}`,
  //         inline: true,
  //       },
  //       {
  //       // 2
  //         name: 'ID',
  //         value: target.id,
  //         inline: true,
  //       },
  //       {
  //       // 3
  //         name: 'Tag',
  //         value: target.user.tag,
  //         inline: true,
  //       },
  //       {
  //       // 4
  //         name: 'Username',
  //         value: target.user.username,
  //         inline: true,
  //       },
  //       {
  //       // 5
  //         name: 'Is Bot',
  //         value: target.user.bot,
  //         inline: true,
  //       },
  //       {
  //       // 6
  //         name: 'Bannable',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 7
  //         name: 'Kickable',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 8
  //         name: 'Server deafen',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 9
  //         name: 'Server mute',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 10
  //         name: 'Deafened',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 11
  //         name: 'Muted',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 12
  //         name: 'Roles',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 13
  //         name: 'Status',
  //         value: target.presence.status,
  //         inline: true,
  //       },
  //       {
  //       // 16
  //         name: 'Is playing',
  //         value: game,
  //         inline: true,
  //       },
  //       {
  //       // 14
  //         name: 'Last message',
  //         value: '-',
  //       },
  //       {
  //       // 15
  //         name: 'Is writing',
  //         value: '-',
  //         inline: true,
  //       },
  //       {
  //       // 17
  //         name: 'Avatar',
  //         value: target.user.displayAvatarURL,
  //       },
  //     ],
  //     image: {
  //       url: target.user.displayAvatarURL,
  //     },
  //   };
  // }
  // message.channel.send({ embed });
};

module.exports.help = {
  name: 'userinfo',
};
