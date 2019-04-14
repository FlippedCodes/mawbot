const furaffinity = require('furaffinity');

const rp = require('request-promise');

const $ = require('cheerio');

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
  // 5sey timeout
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

  client.on('ready', async () => {
    console.log(`[FurAffinity-API] Logged in as ${client.user.tag}!`);

    client.user.setActivity('with \'?fa\' command');
  });

  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    // TODO: implement own prefix

    if (usedRecently.has(message.author.id)) return message.reply('sowwy, but you can\'t use me this often. Plewse wait 5 secounds between commands.');
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
      case 'e6':
        message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji)).then((reaction_loading) => {
          let [limit] = args;
          let tags = args
            .join(' ')
            .slice(limit.length + 1)
            .replace(', ', ' ');
          if (isNaN(limit) || limit === 0) {
            functions.get('invalid_cmd').run(message, limit);
            reaction_loading.remove(client.user);
            return;
          }
          let uri = 'https://e621.net/post/index.json';
          if (message.channel.nsfw === false) uri = 'https://e926.net/post/index.json';
          if (limit > 10) {
            message.reply('you can only requwest a maximum of 10 images at the twime.');
            reaction_loading.remove(client.user);
            return;
          }
          timeout(message.author.id);
          if (limit > 3) message.reply('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<');
          let request = {
            method: 'POST',
            uri,
            body: {
              limit: '300',
              tags,
            },
            headers: { 'User-Agent': 'Discordbot - Mawbot' },
            json: true,
          };
          rp(request)
            .then((json) => {
              for (let i = 0; i < limit; i++) {
                const randomChoice = Math.floor(Math.random() * json.length);
                let typePic = 'Preview';
                let picURL = json[randomChoice].sample_url;
                let arrow = '🔽';
                const extantion = json[randomChoice].file_ext;
                if (extantion === 'gif' || extantion === 'webm' || extantion === 'swf') {
                  typePic = 'Full Picture';
                  picURL = json[randomChoice].file_url;
                  if (extantion === 'webm' || extantion === 'swf') arrow = json[randomChoice].file_url;
                }
                let embed = new RichEmbed()
                  .setAuthor(`Main Artist: ${json[randomChoice].artist[0]}`)
                  .setColor(message.member.displayColor)
                  .setTitle('E621 Link')
                  .setURL(`https://e621.net/post/show/${json[randomChoice].id}`)
                  .addField(typePic, arrow)
                  .setImage(picURL)
                  .setFooter(client.user.tag, client.user.displayAvatarURL)
                  .setTimestamp();
                message.channel.send({ embed })
                  .then((msg) => {
                    msg.react('↔')
                      .then(() => msg.react('❌'));
                  });
              }
            })
            .then(() => {
              reaction_loading.remove(client.user);
            });
        })
          .catch((err) => {
            message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
              .then(() => message.react('❌'));
            console.error(err);
          });
        return;
      case 'fa':
        if (args.length <= 0) return message.channel.send('Sorry, I couldn\'t find anything, because you didn\'t provide any tags. :(');

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
            for (i = 0; i < 16; i++) {
              if (fa[0].src !== fa[0].src.replace(`@${i}00`, '@1600')) {
                image = fa[0].src.replace(`@${i}00`, '@1600');
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
        timeout(message.author.id);
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
        // timeout(message.author.id);
        timeout(message.author.id);
        return;
      case 'help':
        let embed = new RichEmbed()
          .setAuthor('How to use me:')
          .setColor(message.member.displayColor)
          .addField('E621', `
            ${config.prefix}e6 AMMOUNT TAGS
            You can requwest up to 10 pictures at the twime.
            `)
          .addField('FurAffinity', `
          ${config.prefix}fa SEARCH
          You can currently only requwest SFW pictures. NSFW is in the making.
          `)
          .addField('About', `
          ${config.prefix}about
          Learn mowre about me.
          `)
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        message.channel.send({ embed });
        // timeout(message.author.id);
        timeout(message.author.id);
        return;
      default:
        return;
    }
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    // TODO: image deletion if inapropiete
    if (user.bot) return;
    switch (reaction.emoji.name) {
      case '↔':
        const id = reaction.message.embeds[0].url.replace('https://e621.net/post/show/', '');
        const color = reaction.message.embeds[0].color;
        let e621_id = {
          method: 'POST',
          uri: 'https://e621.net/post/show.json',
          body: {
            id,
          },
          headers: {
            'User-Agent': 'Discordbot - Mawbot',
          },
          json: true,
        };
        rp(e621_id)
          .then((json) => {
            let source = 'none';
            let typeSources = 'Sources';
            if (json.sources) {
              source = json.sources.join('\n');
              if (json.sources.length === 1) typeSources = 'Source';
            }
            let rating = 'NSFW';
            if (json.rating === 's') rating = 'NSFW';
            let artists = json.artist.join(', ');
            let typeArtists = 'All artists';
            if (json.artist.length === 1) typeArtists = 'Artist';
            let embed = new RichEmbed()
              .setAuthor(`${typeArtists}: ${json.artist[0]}`)
              .setColor(color)
              .setTitle('E621 Link')
              .setURL(`https://e621.net/post/show/${json.id}`)
              .setDescription(`**Tags:** ${json.tags}`)
              .addField('Rating', rating, true)
              .addField('Score', json.score, true)
              .addField('ID', json.id, true)
              .addField(typeSources, source)
              .addField('Full Picture link', json.file_url)
              .addField('Full Picture', '🔽')
              .setImage(json.file_url)
              .setFooter(client.user.tag, client.user.displayAvatarURL)
              .setTimestamp();
            reaction.message.edit({ embed });
          });
        return;
      case '❌':
        if (!reaction.me) return;
        reaction.message.delete();
        return;
      default:
        return;
    }
  });
};

module.exports.help = {
  name: 'fa_api_bot',
};
