module.exports.run = async (reaction, requester, config, user, con) => {
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
        reaction.message.channel.send('I have removed `Switch` from you, so you can have `Prey`!')
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
        reaction.message.channel.send('I have removed `Prey` from you, so you can have `Switch`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.prey);
      }

      if (requester.roles.find(role => role.id === config.switch)) {
        reaction.message.channel.send('I have removed `Switch` from you!')
          .then(message => message.delete(6000));
        requester.removeRole(config.switch);
        reaction.remove(user);
        return;
      }

      if (requester.roles.find(role => role.id === config.pred)) {
        reaction.message.channel.send('I have removed `Pred` from you, so you can have `Switch`!')
          .then(message => message.delete(6000));
        requester.removeRole(config.pred);
      }

      requester.addRole(config.switch);
      reaction.message.channel.send('Have fun being `Switch`!')
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
        reaction.message.channel.send('I have removed `Switch` from you, so you can have `Pred`!')
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


    case '1⃣':
    // cv
      if (requester.roles.find(role => role.id === config.cv)) {
        reaction.message.channel.send('You no longer have `CV`')
          .then(message => message.delete(6000));
        requester.removeRole(config.cv);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.cv);
      reaction.message.channel.send('You now have `CV`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '2⃣':
    // ov
      if (requester.roles.find(role => role.id === config.ov)) {
        reaction.message.channel.send('You no longer have `OV`')
          .then(message => message.delete(6000));
        requester.removeRole(config.ov);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.ov);
      reaction.message.channel.send('You now have `OV`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '3⃣':
    // av
      if (requester.roles.find(role => role.id === config.av)) {
        reaction.message.channel.send('You no longer have `AV`')
          .then(message => message.delete(6000));
        requester.removeRole(config.av);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.av);
      reaction.message.channel.send('You now have `AV`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '4⃣':
    // ub

      if (requester.roles.find(role => role.id === config.ub)) {
        reaction.message.channel.send('You no longer have `UB`')
          .then(message => message.delete(6000));
        requester.removeRole(config.ub);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.ub);
      reaction.message.channel.send('You now have `UB`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '5⃣':
    // v+
      if (requester.roles.find(role => role.id === config.vplus)) {
        reaction.message.channel.send('You no longer have `V+`')
          .then(message => message.delete(6000));
        requester.removeRole(config.vplus);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.vplus);
      reaction.message.channel.send('You now have `V+`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '6⃣':
    // pv
      if (requester.roles.find(role => role.id === config.pv)) {
        reaction.message.channel.send('You no longer have `PV`')
          .then(message => message.delete(6000));
        requester.removeRole(config.pv);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.pv);
      reaction.message.channel.send('You now have `PV`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '💩':
      if (requester.roles.find(role => role.id === config.disposal)) {
        reaction.message.channel.send('You no longer have `Disposal`')
          .then(message => message.delete(6000));
        requester.removeRole(config.disposal);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.disposal);
      reaction.message.channel.send('You now have `Disposal`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '🎨':
      if (requester.roles.find(role => role.id === config.artist)) {
        reaction.message.channel.send('You no longer have `Artist`')
          .then(message => message.delete(6000));
        requester.removeRole(config.artist);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.artist);
      reaction.message.channel.send('You now have `Artist`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    case '🔤':
      if (requester.roles.find(role => role.id === config.rp)) {
        reaction.message.channel.send('You no longer have `RP`')
          .then(message => message.delete(6000));
        requester.removeRole(config.rp);
        reaction.remove(user);
        return;
      }

      requester.addRole(config.rp);
      reaction.message.channel.send('You now have `RP`')
        .then(message => message.delete(6000));
      reaction.remove(user);
      return;

    default:
      return;
  }
};

module.exports.help = {
  name: 'role_request_cvl',
};
