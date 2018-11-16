module.exports.run = async (reaction, requester, config, user, con) => {
  reaction.message.channel.send(`${user.tag},`)
    .then(message => message.delete(6000));

  switch (reaction.emoji.name) {
    case '1⃣':
      if (requester.roles.find('id', config.prey)) {
        reaction.message.channel.send('I have removed `Prey` from you!')
          .then(message => message.delete(6000));
        requester.removeRole(config.prey);
        reaction.remove(user);
        return;
      }

      if (requester.roles.find('id', config.switch)) {
        reaction.message.channel.send('I have removed `Prey/Pred` from you, so you can have `Prey`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.switch);
      }

      if (requester.roles.find('id', config.pred)) {
        reaction.message.channel.send('I have removed `Pred` from you, so you can have `Prey`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.pred);
      }

      requester.addRole(config.prey);
      reaction.message.channel.send('Have fun being `Prey`!')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '2⃣':
      if (requester.roles.find('id', config.prey)) {
        reaction.message.channel.send('I have removed `Prey` from you, so you can have `Prey/Pred`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.prey);
      }

      if (requester.roles.find('id', config.switch)) {
        reaction.message.channel.send('I have removed `Prey/Pred` from you!')
          .then(message => message.delete(6000));
        requester.removeRole(config.switch);
        reaction.remove(user);
        return;
      }

      if (requester.roles.find('id', config.pred)) {
        reaction.message.channel.send('I have removed `Pred` from you, so you can have `Prey/Pred`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.pred);
      }

      requester.addRole(config.switch);
      reaction.message.channel.send('Have fun being `Prey/Pred`!')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '3⃣':
      if (requester.roles.find('id', config.prey)) {
        reaction.message.channel.send('I have removed `Prey` from you, so you can have `Pred`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.prey);
      }

      if (requester.roles.find('id', config.switch)) {
        reaction.message.channel.send('I have removed `Prey/Pred` from you, so you can have `Pred`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.switch);
      }

      if (requester.roles.find('id', config.pred)) {
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

    case '4⃣':
      con.query(`SELECT * FROM custom_roles_ban WHERE id = '${requester.id}'`, (err, rows) => {
        if (err) throw err;

        if (rows.length < 1) {
          if (requester.roles.find('id', config.noNSFW)) {
            reaction.message.channel.send('The NSFW channels are shown now!')
              .then(message => message.delete(6000));
            requester.removeRole(config.noNSFW);
            reaction.remove(user);
            return;
          }

          requester.addRole(config.noNSFW);
          reaction.message.channel.send('The NSFW channels are hidden now!')
            .then(message => message.delete(6000));
        } else {
          reaction.message.channel.send('Sorry, but due to repeated breaking of rules, you have been disallowed of the ability to assign this role.')
            .then(message => message.delete(6000));
        }
        reaction.remove(user);
      });
      return;

    case '5⃣':
      con.query(`SELECT * FROM custom_roles_ban WHERE id = '${requester.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows.length < 1) {
        // if (!rows[0]) {
          if (requester.roles.find('id', config.NSFL)) {
            reaction.message.channel.send('The NSFL channels are hidden now!')
              .then(message => message.delete(6000));
            requester.removeRole(config.NSFL);
            reaction.remove(user);
            return;
          }

          requester.addRole(config.NSFL);
          reaction.message.channel.send('The NSFL channels are shown now!')
            .then(message => message.delete(6000));
        } else {
          reaction.message.channel.send('Sorry, but due to repeated breaking of rules, you have been disallowed of the ability to assign this role.')
            .then(message => message.delete(6000));
        }
        reaction.remove(user);
      });
      return;

    default:
      return;
  }
};

module.exports.help = {
  name: 'reaction_role_request',
};
