const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

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

con.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
});

// loadin serverIDs
const servers = require('./config/servers.json');

const blacklist = require('./config/blacklist.json');

const time = new Date(0);

client.commands = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log('No CMD(s) to load!');
    return;
  }

  console.log(`Loading ${jsfiles.length} command(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./commands/${f}`);
    console.log(`   ${i + 1}) Loaded: ${f}!`);
    client.commands.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} command(s)!`);
});

// ---------------------

client.functions = new Discord.Collection();
fs.readdir('./functions/', (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.log('No function(s) to load!');
    return;
  }

  console.log(`Loading ${jsfiles.length} function(s)...`);

  jsfiles.forEach((f, i) => {
    let probs = require(`./functions/${f}`);
    console.log(`   ${i + 1}) Loaded: ${f}!`);
    client.functions.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} function(s)!`);
});

// login!
if (fs.existsSync('./config/test_token.json')) {
  client.login(token.token);
} else {
  client.login(process.env.BOT_TOKEN);
}


client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // set status
  client.functions.get('setup_status').run(client, fs)
    .then(() => console.log('Set status!'));

  // set rolerequest message
  client.functions.get('setup_role_request').run(client, servers)
    .then(() => console.log('Resetted rolerequest!'));

  // set saveme message
  client.functions.get('setup_saveme').run(client, servers)
    .then(() => console.log('Resetted saveme!'));
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
  if (reaction.message.guild.id === servers.night_dragon) {
    config = require('./config/night_dragon/config.json');
  }
  if (reaction.message.guild.id === servers.voretv) {
    config = require('./config/voretv/config.json');
  }
  if (reaction.message.guild.id === servers.testing) {
    config = require('./config/testing/config.json');
  }

  if (reaction.message.channel.id === servers.sharedChannel_night_dragon) return;
  if (reaction.message.channel.id === servers.sharedChannel_voretv) return;
  if (reaction.message.channel.id === servers.sharedChannel_NSFWnight_dragon) return;
  if (reaction.message.channel.id === servers.sharedChannel_NSFWvoretv) return;

  client.functions.get('reaction_add_log').run(user, config, client, reaction);

  // check if reaction is from rolerequest
  if (reaction.message.channel.id === config.rolerequest) client.functions.get('reaction_role_request').run(reaction, requester, config, user, con);

  // check if reaction is from check-in
  if (reaction.message.channel.id === config.checkin_channelID && reaction.emoji.name === '👌') client.functions.get('reaction_add_check-in').run(user, reaction, config, client);

  // check if reaction is from keep me
  if (reaction.message.channel.id === config.saveme_channelID && reaction.emoji.name === '👌') client.functions.get('reaction_saveme').run(reaction, requester, user, con);
});

client.on('disconnected', () => { client.user.setStatus('offline'); });

client.on('message', async (message) => {
  // conditions
  if (message.author.bot) return;
  if (message.channel.type === 'dm') {
    message.reply('Do not talk to me! I\'m shy in DM 😖');
    message.react('❌');
    return;
  }

  let config;
  if (message.channel.guild.id === servers.main) {
    config = require('./config/main/config.json');
  }
  if (message.channel.guild.id === servers.night_dragon) {
    config = require('./config/night_dragon/config.json');
  }
  if (message.channel.guild.id === servers.voretv) {
    config = require('./config/voretv/config.json');
  }
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
      message.channel.send('Sorry There are no team members currently online.\nPlease wait until someone is available!');
    }
    return;
  }

  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(config.prefix)) return;

  con.query(`SELECT * FROM disabled_channels WHERE id = '${message.channel.id}'`, (err, rows) => {
    if (err) throw err;
    if (rows[0]) {
      if (!message.member.roles.find('name', config.teamRole)) {
        message.guild.channels.get(config.logMessageDelete).send(`[SYSTEM MESSAGE] ${message.author.id} (${message.author.tag} | ${message.author.username}) tried using a command in <#${rows[0].id}> and got blocked doing it!`);
        message.author.send(`Sorry, but you can't use comments in <#${rows[0].id}>!`)
          .then(message.delete());
        return;
      }
    }

    let cmd = client.commands.get(command.slice(config.prefix.length));

    if (cmd) {
      cmd.run(client, message, args, con, config)
        .catch(console.log);
    } else {
      message.react('❌')
        .catch(console.log);
    }
  });
});

client.on('guildMemberAdd', (guildMember) => {
  let config;
  if (guildMember.guild.id === servers.main) {
    config = require('./config/main/config.json');
  }
  if (guildMember.guild.id === servers.night_dragon) {
    config = require('./config/night_dragon/config.json');
  }
  if (guildMember.guild.id === servers.voretv) {
    config = require('./config/voretv/config.json');
  }
  if (guildMember.guild.id === servers.testing) {
    config = require('./config/testing/config.json');
  }

  con.query(`SELECT * FROM muted_user WHERE id = '${guildMember.id}'`, (err, rows) => {
    if (err) throw err;
    if (rows[0]) {
      guildMember.addRole(guildMember.guild.roles.find('id', config.mutedRole));
      guildMember.send('Sorry, but you have been muted before on this server. Please don\'t try to rejoin to get rid of the mute!');
      client.channels.get(config.muteChannel).send(`[SYSTEM MESSAGE] <@&${config.team}> >>${guildMember.id} (${guildMember.user.tag} | ${guildMember.user.username}) tried to relog while muted!<<`);
    }
  });
});

client.on('error', e => console.error(e));

client.on('warn', e => console.warn(e));

client.on('debug', (e) => { if (fs.existsSync('./config/test_token.json')) console.info(e); });
