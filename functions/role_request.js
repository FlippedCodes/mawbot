const { RichEmbed } = require('discord.js');

module.exports.run = async (client, reaction, requester, config, user, con) => {
  function signing(user, role) {
    requester.send('Hey there! I saw you requesting an adult role.\nCan I please have your IRL age? (numbers only)\nPlease be aware that we are recording your age in your database and in a log channel on our server. If you don\'t wish your age recorded anywhere, please type \'exit\' to abort.')
      .then((message) => {
        reaction.remove(requester);
        const filter = m => m.content;
        message.channel.awaitMessages(filter, { max: 1, time: 40000, errors: ['time'] })
          .then((collected) => {
            let msg = collected.array()[0].content;
            if (isNaN(msg)) {
              if (msg.startsWith('exit')) {
                message.channel.send('Alright, I am not going to record your age. Sadly I am not allowed to give you the role you requested.\n Thank you anyways ^^\n\nYou can retry anytime.');
                return;
              }
              message.channel.send('Sorry that is not a valid entry. Please try again by assigning an adult role.');
              return;
            }
            if (msg > 99) return message.channel.send('It seems like you are in the right age... Hold on, thats a little too old dont you think? Please try again but not with your OCs age ^^');
            let embed = new RichEmbed()
              .setTitle('Entry created!')
              .setFooter(client.user.tag, client.user.displayAvatarURL)
              .setTimestamp()
              .setDescription(`\`${requester.user.tag}\` signed up for 18+ rooms!`)
              .addField('ID', requester.id, true)
              .addField('Submitted age', msg, true);
            if (msg >= 18) {
              requester.addRole(role);
              con.query(`INSERT INTO custom_roles_userage (userID, userAge, submitted, changed, allowed) VALUE ('${requester.id}', '${msg}', '${Date.now()}', '${Date.now()}', '1')`);
              message.channel.send('It seems like you are in the right age to view explicit material.\nI have assigned you your role you wanted.\nThis setup will no longer bother you and I wish you a great day :3');
              embed
                .setColor(65339)
                .addField('Allowed', 'true', true);
            } else {
              con.query(`INSERT INTO custom_roles_userage (userID, userAge, submitted, changed, allowed) VALUE ('${requester.id}', '${msg}', '${Date.now()}', '${Date.now()}', '0')`);
              message.channel.send('Sorry, but you are not in the right age to view this content. If you typed your age wrong, please contact one of the teammember for further review.');
              embed
                .setColor(16720128)
                .addField('Allowed', 'false', true);
            }
            client.channels.get(config.logAge).send(embed);
          })
          .catch((collected) => {
            message.channel.send('It seems like you took to long to awnser. Please try getting another role or contact the team if this error´and it persits.');
          });
      });
  }
  function forbidden(user) {
    // TODO: create a rich embet
    reaction.message.channel.send(`Sorry <@${user}>, but due to your age, you are not allowed to assign this role.\nPlease ask a teammember if you think that this is a missunderstanding.`)
      .then(message => message.delete(10000));
    reaction.remove(user);
  }

  let allowed;
  let signed;
  con.query(`SELECT * FROM custom_roles_userage WHERE userID = '${requester.id}'`, (err, rows) => {
    if (err) throw err;
    if (rows.length >= 1) {
      signed = true;
      if (rows[0].allowed === 1) { allowed = true; } else { allowed = false; }
    }

    reaction.message.channel.send(`${user.tag},`)
      .then(message => message.delete(6000));

    switch (reaction.emoji.name) {
      case '🦌':
        if (requester.roles.find(role => role.id === config.prey)) {
          reaction.message.channel.send('I have removed `Prey` from you!')
            .then(message => message.delete(6000));
          requester.removeRole(config.prey);
          reaction.remove(user);
          return;
        }

        if (requester.roles.find(role => role.id === config.switch)) {
          reaction.message.channel.send('I have removed `Prey/Pred` from you, so you can have `Prey`!')
            .then(message => message.delete(6000));
          requester.removeRole(config.switch);
        }

        if (requester.roles.find(role => role.id === config.pred)) {
          reaction.message.channel.send('I have removed `Pred` from you, so you can have `Prey`!')
            .then(message => message.delete(6000));
          requester.removeRole(config.pred);
        }

        requester.addRole(config.prey);
        reaction.message.channel.send('Have fun being `Prey`!')
          .then(message => message.delete(6000));
        reaction.remove(user);
        return;

      case '🔄':
        if (requester.roles.find(role => role.id === config.prey)) {
          reaction.message.channel.send('I have removed `Prey` from you, so you can have `Prey/Pred`!')
            .then(message => message.delete(6000));
          requester.removeRole(config.prey);
        }

        if (requester.roles.find(role => role.id === config.switch)) {
          reaction.message.channel.send('I have removed `Prey/Pred` from you!')
            .then(message => message.delete(6000));
          requester.removeRole(config.switch);
          reaction.remove(user);
          return;
        }

        if (requester.roles.find(role => role.id === config.pred)) {
          reaction.message.channel.send('I have removed `Pred` from you, so you can have `Prey/Pred`!')
            .then(message => message.delete(6000));
          requester.removeRole(config.pred);
        }

        requester.addRole(config.switch);
        reaction.message.channel.send('Have fun being `Prey/Pred`!')
          .then(message => message.delete(6000));
        reaction.remove(user);
        return;

      case '🐉':
        if (requester.roles.find(role => role.id === config.prey)) {
          reaction.message.channel.send('I have removed `Prey` from you, so you can have `Pred`!')
            .then(message => message.delete(6000));
          requester.removeRole(config.prey);
        }

        if (requester.roles.find(role => role.id === config.switch)) {
          reaction.message.channel.send('I have removed `Prey/Pred` from you, so you can have `Pred`!')
            .then(message => message.delete(6000));
          requester.removeRole(config.switch);
        }

        if (requester.roles.find(role => role.id === config.pred)) {
          reaction.message.channel.send('I have removed `Pred` from you!')
            .then(message => message.delete(6000));
          requester.removeRole(config.pred);
          reaction.remove(user);
          return;
        }

        requester.addRole(config.pred);
        reaction.message.channel.send('Have fun being `Pred`!')
          .then(message => message.delete(6000));
        reaction.remove(user);
        return;

      case '🔞':
        if (requester.roles.find(role => role.id === config.NSFW)) {
          reaction.message.channel.send('The NSFW channels are hidden now!')
            .then(message => message.delete(6000));
          requester.removeRole(config.NSFW);
          reaction.remove(user);
        } else {
          if (!signed) return signing(reaction.message.author, config.NSFW);
          if (allowed) {
            requester.addRole(config.NSFW);
            reaction.message.channel.send('The NSFW channels are shown now!')
              .then(message => message.delete(6000));
            reaction.remove(user);
          } else {
            forbidden(requester.id);
            return;
          }
        }
        return;

      case '💩':
        if (requester.roles.find(role => role.id === config.NSFL)) {
          reaction.message.channel.send('The NSFL channels are hidden now!')
            .then(message => message.delete(6000));
          requester.removeRole(config.NSFL);
          reaction.remove(user);
        } else {
          if (!signed) return signing(reaction.message.author, config.NSFL);
          if (allowed) {
            requester.addRole(config.NSFL);
            reaction.message.channel.send('The NSFL channels are shown now!')
              .then(message => message.delete(6000));
            reaction.remove(user);
          } else {
            forbidden(requester.id);
            return;
          }
        }
        return;

      default:
        return;
    }
  });
};

module.exports.help = {
  name: 'role_request',
};
