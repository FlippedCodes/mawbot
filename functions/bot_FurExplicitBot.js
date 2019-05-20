const Discord = require('discord.js');

const { RichEmbed } = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const config = require('../config/furaffinity/config.json');

const usedRecently = new Set();

function timeout(id) {
  usedRecently.add(id);
  setTimeout(() => {
    usedRecently.delete(id);
  }, 5000);
  // 5sec timeout
}

module.exports.run = async (fs, functions) => {
  // login
  let token;
  let clientID;
  if (fs.existsSync('./config/test_token.json')) {
    token = require('../config/test_token.json');
    client.login(token.test_token_fa);
    clientID = config.clientIDTesting;
    // Login(token.fa_cookie_a, token.fa_cookie_b);
  } else {
    client.login(process.env.BOT_TOKEN_FA);
    clientID = config.clientID;
    // Login(process.env.FA_COOKIE_A, process.env.FA_COOKIE_B);
  }

  client.commands = new Discord.Collection();
  fs.readdir('./commands/FurExplicitBot/', (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
      console.log('[FurAffinity-API] No CMD(s) to load!');
      return;
    }

    console.log(`[FurAffinity-API] Loading ${jsfiles.length} command(s)...`);
    jsfiles.forEach((f, i) => {
      let probs = require(`../commands/FurExplicitBot/${f}`);
      console.log(`[FurAffinity-API]    ${i + 1}) Loaded: ${f}!`);
      client.commands.set(probs.help.name, probs);
    });
    console.log(`[FurAffinity-API] Loaded ${jsfiles.length} command(s)!`);
  });

  // ---------------------

  client.functions = new Discord.Collection();
  fs.readdir('./functions/FurExplicitBot/', (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
      console.log('[FurAffinity-API] No function(s) to load!');
      return;
    }

    console.log(`[FurAffinity-API] Loading ${jsfiles.length} function(s)...`);

    jsfiles.forEach((f, i) => {
      let probs = require(`../functions/FurExplicitBot/${f}`);
      console.log(`[FurAffinity-API]    ${i + 1}) Loaded: ${f}!`);
      client.functions.set(probs.help.name, probs);
    });
    console.log(`[FurAffinity-API] Loaded ${jsfiles.length} function(s)!`);
  });

  client.on('ready', async () => {
    console.log(`[FurAffinity-API] Logged in as ${client.user.tag} serving ${client.guilds.size} Servers!`);

    client.user.setActivity('with \'+help\' command');
  });

  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    // TODO: implement own prefix

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(config.prefix)) return;

    let cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

    if (cmd) {
      if (!usedRecently.has(message.author.id)) {
        timeout(message.author.id);
        cmd.run(client, message, args, config, functions, RichEmbed)
          .catch(console.log);
      } else {
        message.reply('sowwy, but you can\'t use me that often. Plewse wait 5 secounds between commands.');
      }
    }
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    // TODO: image deletion if inapropiete
    if (user.bot) return;
    client.functions.get('e621_detailed').run(client, reaction, user, config, RichEmbed, functions, fs);
  });
};

module.exports.help = {
  name: 'bot_FurExplicitBot',
};
