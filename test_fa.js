const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const fs = require('fs');

let token;

if (fs.existsSync('./config/test_token.json')) {
  token = require('./config/test_token.json');
}

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

// loading serverIDs
const servers = require('./config/servers.json');

const blacklist = require('./config/blacklist.json');

client.on('ready', async () => {
  const config = require('./config/main/config.json');

  // load second bot
  console.log('Starting FurAffinity bot!');
  client.functions.get('fa_api_bot').run(fs, config);
});

client.on('error', e => console.error(e));

client.on('warn', e => console.warn(e));
