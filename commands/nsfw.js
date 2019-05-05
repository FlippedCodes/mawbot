const { RichEmbed } = require('discord.js');

const toTime = require('pretty-ms');

module.exports.run = async (client, message, args, con, config) => {
  function roleremoval(id) {
    if (message.guild.members.get(id)) {
      const userwithrole = message.guild.members.get(id);
      userwithrole.removeRoles(config.NSFL)
        .catch(console.log);
      userwithrole.addRole(config.NSFW)
        .catch(console.log);
    } else {
      message.channel.send('I am unable to remove the roles from the user. They are not in this server.');
    }
  }

  if (!message.member.roles.find(role => role.name === config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the **teammembers** can use this~`).then(message.react('❌'));

  let [subcmd, target, age] = args;

  // let target;
  if (subcmd !== 'help') {
    if (!target) return message.channel.send('Please provide an ID');
    if (isNaN(target)) return message.channel.send('The querry only takes IDs, sry');
  }
  // if (message.mentions.members.first().id || message.guild.members.get(name).user.id) {
  //   target = message.mentions.members.first() || message.guild.members.get(name).user.id;
  // } else { target = name }

  con.query(`SELECT * FROM custom_roles_userage WHERE userID = '${target}'`, (err, rows) => {
    if (err) throw err;
    let embed = new RichEmbed();
    let member;
    if (message.guild.members.get(target)) {
      member = message.guild.members.get(target).user.tag;
    } else { member = target; }
    switch (subcmd) {
      case 'create':
        embed
          .setTitle('Create entry')
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        if (isNaN(age)) return message.channel.send('The userage provided is not a number!');
        if (!rows.length >= 1) {
          let allowed;
          if (age >= 18) {
            allowed = 1;
          } else {
            allowed = 0;
            roleremoval(target);
          }
          con.query(`INSERT INTO custom_roles_userage (userID, userAge, submitted, changed, allowed) VALUE ('${target}', '${age}', '${Date.now()}', '${Date.now()}', '${allowed}')`);
          embed
            .setDescription(`The entry for \`${member}\` with the age of \`${age}\` got created!`)
            .addField('Created by', message.member.user.tag, true);
          client.channels.get(config.logAge).send(embed);
        } else {
          embed.setDescription('This user has already a DB entry!');
        }
        message.channel.send(embed);
        return;
      case 'allow':
        if (!age) return message.channel.send('Please provide a bool at the end');
        if (age.toLowerCase() === 'true') {
          age = 1;
        } else if (age.toLowerCase() === 'false') {
          age = 0;
          roleremoval(target);
        } else return message.channel.send('The argument provided is not a boolean (true/false)');
        embed
          .setTitle('Allow changing')
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        if (rows.length >= 1) {
          con.query(`UPDATE custom_roles_userage SET allowed = '1' WHERE userID = '${target}'`);
          con.query(`UPDATE custom_roles_userage SET changed = '${Date.now()}' WHERE userID = '${target}'`);
          embed
            .setDescription(`\`${member}\` found in the database!`)
            .addField('ID', rows[0].userID, true)
            .addField('Old allowence', rows[0].allowed, true)
            .addField('Newly submitted allowence', age, true)
            .addField('Changed by', message.member.user.tag, true);
          client.channels.get(config.logAge).send(embed);
        } else {
          embed.setDescription('There has been found no user with the information provided!');
        }
        message.channel.send(embed);
        return;
      case 'age':
      // TODO: remove roles
        embed
          .setTitle('Age changing')
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        if (isNaN(age)) return message.channel.send('The userage provided is not a number!');
        if (rows.length >= 1) {
          let allowed;
          if (age >= 18) {
            allowed = 1;
          } else {
            allowed = 0;
            roleremoval(target);
          }
          con.query(`UPDATE custom_roles_userage SET userAge = '${age}' WHERE userID = '${target}'`);
          con.query(`UPDATE custom_roles_userage SET allowed = '${allowed}' WHERE userID = '${target}'`);
          con.query(`UPDATE custom_roles_userage SET changed = '${Date.now()}' WHERE userID = '${target}'`);
          embed
            .setDescription(`\`${member}\` found in the database!`)
            .addField('ID', rows[0].userID, true)
            .addField('Old age', rows[0].userAge, true)
            .addField('Newly submitted age', age, true)
            .addField('Changed by', message.member.user.tag, true);
          client.channels.get(config.logAge).send(embed);
        } else {
          embed.setDescription('There has been found no user with the information provided!');
        }
        message.channel.send(embed);
        return;
      case 'search':
        let allowed;
        embed
          .setTitle('DB Querry')
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        if (rows.length >= 1) {
          if (rows[0].allowed === 1) { allowed = true; } else { allowed = false; }
          embed
            .setDescription(`\`${member}\` found in the database!`)
            .addField('ID', rows[0].userID, true)
            .addField('Submitted age', rows[0].userAge, true)
            .addField('Allowed', `${allowed}`, true)
            .addField('Submitted date', `${new Date(rows[0].submitted * 1)}`, true)
            .addField('last change', `${new Date(rows[0].changed * 1)}`, true);
        } else {
          embed.setDescription('There has been found no user with the information provided!');
        }
        message.channel.send(embed);
        return;
      case 'help':
        embed
          .setAuthor(`Help for ${config.prefix}nsfw`)
          .setColor(message.member.displayColor)
          .addField('DB Querry', `
            ${config.prefix}nsfw search ID
            Looks through the database and provides the entry if found.
            `)
          .addField('Age changing', `
            ${config.prefix}nsfw age ID NEWAGE
            Changed the age for the provided ID.
            This also changes the allowence depending on the provided age.
            `)
          .addField('Allow changing', `
            ${config.prefix}nsfw allow ID TRUE|FALSE
            Changed the allowence for the provided ID.
            `)
          .addField('Create entry', `
            ${config.prefix}nsfw create ID AGE
            Creates a DB entry for the provided ID, if not already submitted.
            `)
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        message.channel.send({ embed });
        return;
      default:
        client.functions.get('invalid_cmd').run(message, subcmd)
          .catch(console.log);
        return;
    }
  });
};

module.exports.help = {
  name: 'nsfw',
};
