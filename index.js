const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const text = require('./config/messages.json');

const mysql = require('mysql');

const fs = require('fs');

let token;

// let con = '// lol ';

let con;

if (fs.existsSync('./config/test_token.json')) {
  token = require('./config/test_token.json');
  con = mysql.createConnection({
    host: token.DB_host,
    user: token.DB_user,
    password: token.DB_passw,
    database: token.DB_name,
  });
} else {
  con = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_passw,
    database: process.env.DB_name,
  });
}

// login!
if (fs.existsSync('./config/test_token.json')) {
  client.login(token.token);
} else {
  client.login(process.env.BOT_TOKEN);
}

con.connect((err) => {
  if (err) throw err;
  console.log(text.log.startup.success.db);
});

// loading serverIDs
const servers = require('./config/servers.json');

const blacklist = require('./config/blacklist.json');

client.commands = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log(text.log.init.failed.nothing_found);
    return;
  }

  console.log(text.log.init.working.load, jsfiles.length, text.log.init.cmd);
  jsfiles.forEach((f, i) => {
    let probs = require(`./commands/${f}`);
    console.log(text.log.init.success.entry, i + 1, f);
    client.commands.set(probs.help.name, probs);
  });
  console.log(text.log.init.success.load, jsfiles.length, text.log.init.cmd);
});

// ---------------------

client.functions = new Discord.Collection();
fs.readdir('./functions/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log(text.log.init.failed.nothing_found);
    return;
  }

  console.log(text.log.init.working.load, jsfiles.length, text.log.init.function);
  jsfiles.forEach((f, i) => {
    let probs = require(`./functions/${f}`);
    console.log(text.log.init.success.entry, i + 1, f);
    client.functions.set(probs.help.name, probs);
  });
  console.log(text.log.init.success.load, jsfiles.length, text.log.init.function);
});

client.on('ready', async () => {
  const config = require('./config/main/config.json');

  console.log(text.log.startup.success.user_logged_in, text.mawbot.name, client.user.tag);
  // set status
  client.functions.get('setup_status').run(client, fs)
    .then(() => console.log(text.log.startup.success.status));

  // set rolerequest message
  client.functions.get('setup_role_request').run(client, servers, config)
    .then(() => console.log(text.log.startup.success.rolerequest));

  // set saveme message
  client.functions.get('setup_saveme').run(client, servers)
    .then(() => console.log(text.log.startup.success.saveme));

  // load and start RP-room timers
  console.log(text.log.startup.working.rp_timers);
  client.functions.get('rp_timer').run(client, servers, fs, con);

  // Load and posting bot status
  console.log(text.log.startup.working.status_message);
  client.functions.get('stat_message_log').run(client, config, con, fs);

  // load second bot
  // console.log('Starting FurAffinity bot!');
  // client.functions.get('fa_api_bot').run(fs, config);

  console.log(text.log.startup.working.cvl_bot);
  client.functions.get('cvl_roleassignment_bot').run(fs, client.functions);
});

client.on('messageReactionRemove', async (reaction, user) => {
  client.functions.get('reaction_remove').run(reaction, servers, user, client);
});

client.on('messageReactionAdd', async (reaction, user) => {
  // log Reactions, add message and time and shit to the log.
  if (user.bot) return;

  const requester = reaction.message.guild.member(user);

  let config;
  if (reaction.message.guild.id === servers.main) {
    config = require('./config/main/config.json');
  }
  // if (reaction.message.guild.id === servers.night_dragon) {
  //   config = require('./config/night_dragon/config.json');
  // }
  // if (reaction.message.guild.id === servers.voretv) {
  //   config = require('./config/voretv/config.json');
  // }
  if (reaction.message.guild.id === servers.testing) {
    config = require('./config/testing/config.json');
  }

  let RPChannelArchive;
  let RPChannelLog;
  let RPChannelCategory;

  if (fs.existsSync('./config/test_token.json')) {
    RPChannelArchive = servers.RPChannelArchive_testing;
    RPChannelLog = servers.RPChannelLog_testing;
    RPChannelCategory = servers.RPChannelCategory_testing;
  } else {
    RPChannelArchive = servers.RPChannelArchive_main;
    RPChannelLog = servers.RPChannelLog_main;
    RPChannelCategory = servers.RPChannelCategory_main;
  }

  if (reaction.message.channel.id === servers.sharedChannel_night_dragon) return;
  if (reaction.message.channel.id === servers.sharedChannel_voretv) return;
  if (reaction.message.channel.id === servers.sharedChannel_NSFWnight_dragon) return;
  if (reaction.message.channel.id === servers.sharedChannel_NSFWvoretv) return;

  client.functions.get('reaction_add_log').run(user, config, client, reaction);

  // check if reaction is from rolerequest
  if (reaction.message.channel.id === config.rolerequest) client.functions.get('role_request').run(reaction, requester, config, user, con);

  // check if reaction is from check-in
  if (reaction.message.channel.id === config.checkin_channelID && reaction.emoji.name === '👌') client.functions.get('reaction_add_check-in').run(user, reaction, config, client);

  // check if reaction is from keep me
  if (reaction.message.channel.id === config.saveme_channelID && reaction.emoji.name === '👌') client.functions.get('reaction_saveme').run(reaction, requester, user, con);

  // check if reaction is from arcived rooms
  // got moved to cmd because of botrestarting problems
  // if (reaction.message.channel.parent.id === RPChannelArchive && reaction.emoji.name === '🔓') client.functions.get('reaction_reactivate').run(config, client, reaction, RPChannelLog, user, RPChannelCategory);

  // reactions for own-rp-channels
  if (reaction.message.channel.parent.id === RPChannelCategory) {
    if (reaction.emoji.name === '🚪') client.functions.get('reaction_rp_setup').run('RPPrivate', config, client, reaction, RPChannelLog, con, user);
    if (reaction.emoji.name === '🔓') client.functions.get('reaction_rp_setup').run('RPPublic', config, client, reaction, RPChannelLog, con, user);
    if (reaction.emoji.name === '🔅') client.functions.get('reaction_rp_setup').run('TypeSFW', config, client, reaction, RPChannelLog, con, user);
    if (reaction.emoji.name === '🔞') client.functions.get('reaction_rp_setup').run('TypeNSFW', config, client, reaction, RPChannelLog, con, user);
    if (reaction.emoji.name === '☠') client.functions.get('reaction_rp_setup').run('TypeNSFL', config, client, reaction, RPChannelLog, con, user);
  }
});

client.on('message', async (message) => {
  // conditions
  if (message.author.bot) return;
  if (message.channel.type === 'dm') {
    message.reply(text.mawbot.messages.dm.shy);
    message.react(text.mawbot.messages.dm.shy_react);
    return;
  }

  con.query(`SELECT * FROM rp_timer WHERE id = '${message.channel.id}' AND archived = 'f'`, async (err, rows) => {
    if (err) throw err;
    if (rows[0]) {
      con.query(`UPDATE rp_timer SET timeLeft = '${servers.RPChannelTime}' WHERE id = '${message.channel.id}'`);
      con.query(`UPDATE rp_timer SET warned = 'f' WHERE id = '${message.channel.id}' AND warned = 't'`);
    }
  });

  let config;
  if (message.channel.guild.id === servers.main) {
    config = require('./config/main/config.json');
  }
  // if (message.channel.guild.id === servers.night_dragon) {
  //   config = require('./config/night_dragon/config.json');
  // }
  // if (message.channel.guild.id === servers.voretv) {
  //   config = require('./config/voretv/config.json');
  // }
  if (message.channel.guild.id === servers.testing) {
    config = require('./config/testing/config.json');
  }

  // let config = client.functions.get('config').run(servers, message);

  // settings
  let teamlist;
  if (message.guild.id === servers.main || message.guild.id === servers.testing) teamlist = message.guild.roles.get(config.team).members.map(s => s.presence.status).sort().join('\n');

  if (message.channel.id === config.sharedChannel) client.functions.get('channel_shared_sfw').run(client, message, blacklist, servers);

  if (message.channel.id === config.NSFWsharedChannel) client.functions.get('channel_shared_nsfw').run(client, message, blacklist, servers);

  if (message.channel.id === servers.sharedChannel_night_dragon) return;
  if (message.channel.id === servers.sharedChannel_voretv) return;
  if (message.channel.id === servers.sharedChannel_NSFWnight_dragon) return;
  if (message.channel.id === servers.sharedChannel_NSFWvoretv) return;

  if (message.isMentioned(config.team) && message.channel.id === config.checkin_channelID) {
    message.react('👌');
    if (teamlist.indexOf('online' || 'dnd') === -1) {
      message.channel.send(text.mawbot.messages.server.checkin.no_teammember);
    }
    return;
  }

  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(config.prefix)) return;

  let cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  if (cmd) {
    cmd.run(client, message, args, con, config)
      .catch(console.log);
  }
});

client.on('error', e => console.error(e));

client.on('warn', e => console.warn(e));

client.on('debug', (e) => { if (fs.existsSync('./config/test_token.json')) console.info(e); });
