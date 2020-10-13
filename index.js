const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const mysql = require('mysql');

const fs = require('fs');

// const checkinWarned = new Set();

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
  console.log('Connected to database!');
});

// loading serverIDs
const servers = require('./config/servers.json');

const blacklist = require('./config/blacklist.json');

client.commands = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log('No CMD(s) to load!');
    return;
  }

  console.log(`Loading ${jsfiles.length} command(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./commands/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.commands.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} command(s)!`);
});

// ---------------------

client.functions = new Discord.Collection();
fs.readdir('./functions/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log('No function(s) to load!');
    return;
  }

  console.log(`Loading ${jsfiles.length} function(s)...`);

  jsfiles.forEach((f, i) => {
    let probs = require(`./functions/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.functions.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} function(s)!`);
});

client.once('ready', async () => {
  await console.log('[ROOT] Starting modules...');

  const config = require('./config/main/config.json');

  console.log(`[MawBot] Logged in as ${client.user.tag}!`);
  // set status
  // client.functions.get('setup_status').run(client, fs)
  //   .then(() => console.log('Set status!'));

  // set rolerequest message
  // client.functions.get('setup_role_request').run(client, servers, config)
  //   .then(() => console.log('Resetted rolerequest!'));

  // load and start RP-room timers
  console.log('Starting up RP timers!');
  client.functions.get('own_rp_timer').run(client, servers, fs, con);

  // Load and posting bot status
  console.log('Posting bot status message!');
  client.functions.get('stat_message_log').run(client, config, con, fs);

  // DISABLED: due to fa connection issues, spamming log and overloading hte internet
  // load and start FA notifications
  // TODO: Create fa notifications ticker
  // console.log('Starting up FA Notifiactions!');
  // client.functions.get('fa_notifications').run(client, fs, config, Discord);

  await console.log('[ROOT] Startup complete! All modules operational!');
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.message.guild.id !== servers.main) return;

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

  if (reaction.emoji.name === 'ℹ') client.functions.get('imagefinder').run('get', client, config, con, reaction, user, reaction.message, reaction.message.attachments.array()[0].url);

  // FIXME: disabled bc testing...
  if (reaction.message.guild.id !== servers.main) return;

  client.functions.get('reaction_add_log').run(servers, user, config, client, reaction);

  // check if reaction is from rolerequest
  // if (reaction.message.channel.id === config.rolerequest) client.functions.get('role_request').run(client, reaction, requester, config, user, con);

  // check if reaction is from check-in
  // if (reaction.message.channel.id === config.checkin_channelID) return client.functions.get('reaction_add_check-in').run(reaction.emoji.name, user, reaction, config, client, Discord);

  // check if reaction is from keep me
  // if (reaction.message.channel.id === config.saveme_channelID && reaction.emoji.name === '👌') return client.functions.get('reaction_saveme').run(reaction, requester, user, con);

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
    // TODO: code cant be run in age setup
    // message.reply('Do not talk to me! I\'m shy in DM 😖');
    // message.react('❌');
    return;
  }

  client.functions.get('own_rp_timemgr').run(message, con, servers);

  let config = require('./config/main/config.json');
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

  if (message.attachments.size > 0) {
    con.query(`SELECT * FROM image_channel WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
      // const emoji = message.reactions.find(reaction => reaction.emoji.name === 'ℹ');
      if (rows[0]) {
        client.functions.get('imagefinder').run(
          'search',
          client,
          config,
          con,
          '',
          '',
          // 'emoji.reaction',
          // emoji.users.find(user => user.bot === false),
          message,
          message.attachments.array()[0].url,
        );
      }
    });
  }

  // let config = client.functions.get('config').run(servers, message);

  // settings
  let teamlist;
  if (message.guild.id === servers.main || message.guild.id === servers.testing) teamlist = message.guild.roles.get(config.team).members.map((s) => s.presence.status).sort().join('\n');

  con.query(`SELECT * FROM shared_channels WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
    if (rows[0]) return client.functions.get('channel_shared').run(client, message, con);
  });

  // if (message.channel.id === config.NSFWsharedChannel) client.functions.get('channel_shared_nsfw').run(client, message, blacklist, servers);

  // other server fallthough
  if (message.channel.guild.id === !config.serverID) return;

  // let userID = message.author.id;
  // if (message.isMentioned(config.team) && message.channel.id === config.checkin_channelID) {
  //   checkinWarned.add(userID);
  //   await message.react('👌');
  //   await message.react('✋');
  //   if (teamlist.indexOf('online' || 'dnd') === -1) {
  //     let embed = new Discord.RichEmbed()
  //       .setDescription('Sorry, but there are no team members currently online (idle excluded).\nPlease wait until someone is available!');
  //     message.channel.send({ embed });
  //   }
  //   return;
  // }
  // if (!message.isMentioned(config.team) && message.channel.id === config.checkin_channelID && !message.member.roles.find((role) => role.id === config.team)) {
  //   if (!checkinWarned.has(userID)) {
  //     let embed = new Discord.RichEmbed()
  //       .setDescription('Hey there,\nthanks for checking out our server, we can\'t check-in you just yet...\nPlease give <#496948681656893440> another read and come back when you\'ve done so. ^^');
  //     message.channel.send({ embed });
  //     checkinWarned.add(userID);
  //   }
  //   return;
  // }

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

client.on('error', (e) => console.error(e));

client.on('warn', (e) => console.warn(e));
