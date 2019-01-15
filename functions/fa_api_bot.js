const Discord = require('discord.js');

const furaffinity = require('furaffinity');

const client = new Discord.Client({ disableEveryone: true });

const config = require('../config/furaffinity/config.json');

module.exports.run = async (fs) => {
  // login
  let token;
  let clientID;
  if (fs.existsSync('./config/test_token.json')) {
    token = require('../config/test_token.json');
    client.login(token.test_token_fa);
    clientID = config.clientIDTesting;
  } else {
    client.login(process.env.BOT_TOKEN_FA);
    clientID = config.clientID;
  }

  client.on('ready', async () => {
    console.log(`[FurAffinity-API] Logged in as ${client.user.tag}!`);

    client.user.setActivity('with \'?fa\' command');
  });

  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    // fix and implement own prefix || message.mentions.members.first().id !== config.clientID || message.mentions.members.first().id !== config.clientIDTesting

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
      case 'fa':
        // get user args
        const keywords = args.join(' ');

        // testcmd
        // message.channel.send(keywords);

        // check args
        // nothing here yet

        // cap max pics
        const limit = 1;

        // loop limit
        // not done yet

        // command get info
        furaffinity.search(keywords, limit).then((fa) => {
          // output
          if (fa[0]) {
            let image;
            let i;
            for (i = 0; i < 8; i++) {
              if (fa[0].src !== fa[0].src.replace(`@${i}00`, '@800')) {
                image = fa[0].src.replace(`@${i}00`, '@800');
                break;
              }
            }
            const embed = {
              title: fa[0].title,
              url: fa[0].url,
              color: message.channel.guild.members.get(clientID).displayColor,
              timestamp: new Date(),
              footer: {
                icon_url: client.user.displayAvatarURL,
                text: client.user.username,
              },
              image: {
                url: image,
              },
              author: {
                name: fa[0].author.name,
                url: fa[0].author.url,
              },
            };
            message.channel.send({ embed });
          } else {
            message.channel.send('Sorry there are no pictures with these keywords.');
          }
        }).catch(err => console.log(err));
        // loop end
        // not here yet
        return;
      case 'about':
        fs.readFile('./config/furaffinity/about.txt', 'utf8', (err, data) => {
          if (err) {
            console.log(err);
            message.react('❌');
            return;
          }
          message.channel.send(data);
        });
        return;
      default:
        return;
    }
  });
};

module.exports.help = {
  name: 'fa_api_bot',
};
