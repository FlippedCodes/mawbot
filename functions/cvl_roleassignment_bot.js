const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const config = require('../config/CVL_bot/config.json');

const servers = require('../config/servers.json');

module.exports.run = async (fs, functions) => {
  // login
  let token;
  if (fs.existsSync('./config/test_token.json')) {
    token = require('../config/test_token.json');
    console.log('[CVL] The Bot is run in a test envirement and gets shutdown now.');
    client.destroy();
  } else {
    client.login(process.env.BOT_TOKEN_CVL);
  }

  client.on('ready', async () => {
    console.log(`[CVL-Bot] Logged in as ${client.user.tag}!`);

    client.user.setActivity('with \'+about\' command');

    if (!client.channels.get(servers.rolerequest_cvl)) return;
    client.channels.get(servers.rolerequest_cvl).bulkDelete(10);
    client.channels.get(servers.rolerequest_cvl).send({
      embed: {
        color: 56063,
        title: 'Rolerequest',
        description: 'Click on the reactions to get the roles!',
        fields: [{
          name: 'Prey',
          value: ':deer:',
          inline: true,
        },
        {
          name: 'Switch',
          value: ':arrows_counterclockwise:',
          inline: true,
        },
        {
          name: 'Predator',
          value: ':dragon:',
          inline: true,
        },
        {
          name: 'Role Player',
          value: ':abc:',
          inline: true,
        },
        {
          name: 'Artist',
          value: ':art:',
          inline: false,
        },
        {
          name: 'CockVore',
          value: ':one:',
          inline: true,
        },
        {
          name: 'OralVore',
          value: ':two:',
          inline: true,
        },
        {
          name: 'AnalVore',
          value: ':three:',
          inline: true,
        },
        {
          name: 'UnBirth',
          value: ':four:',
          inline: true,
        },
        {
          name: 'Other Types of Vore',
          value: ':five:',
          inline: true,
        },
        {
          name: 'PostVore',
          value: ':six:',
          inline: true,
        },
        {
          name: 'Disposal',
          value: ':poop:',
          inline: true,
        },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.displayAvatarURL,
          text: client.user.tag,
        },
      },
    })
      .then(async (message) => {
        await message.react('🦌');
        await message.react('🔄');
        await message.react('🐉');
        await message.react('🔤');
        await message.react('🎨');
        await message.react('1⃣');
        await message.react('2⃣');
        await message.react('3⃣');
        await message.react('4⃣');
        await message.react('5⃣');
        await message.react('6⃣');
        await message.react('💩');
      });
  });

  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') {
      message.reply('Do not talk to me! I\'m shy in DM 😖');
      message.react('❌');
      return;
    }
    if (message.content.indexOf(config.prefix) !== 0) return;
    // fix and implement own prefix || message.mentions.members.first().id !== config.clientID || message.mentions.members.first().id !== config.clientIDTesting

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
      case 'eval':
        const clean = (text) => {
          if (typeof (text) === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); }
          return text;
        };

        const args_eval = message.content.split(' ').slice(1);
        if (!message.author.id === config.admin) return message.channel.send(`Do I know you **${message.author.tag}**? Only the Devs can use this~`).then(message.react('❌'));
        if (message.content.indexOf('token.token' || 'process.env.BOT_TOKEN' || 'token') !== -1) return message.channel.send('Do you think its that easy?\nSry, but cant give you my key...');
        try {
          const code = args_eval.join(' ');
          let evaled = eval(code);

          if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }

          message.channel.send(clean(evaled), { code: 'xl' });
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
            .then(message.react('❌'));
        }
        return;
      case 'about':
        fs.readFile('./config/furaffinity/about.txt', 'utf8', (err, data) => {
          if (err) {
            console.log(err);
            message.channel.send('Sorry, there seems to be a malfunction. Please try again later...');
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

  client.on('messageReactionAdd', async (reaction, user) => {
    // log Reactions, add message and time and shit to the log.
    if (user.bot) return;

    if (!reaction.message.channel.id === servers.rolerequest_cvl) return;

    const requester = reaction.message.guild.member(user);

    // check if reaction is from rolerequest
    if (reaction.message.channel.id === servers.rolerequest_cvl) functions.get('role_request_cvl').run(reaction, requester, config, user);
  });
};

module.exports.help = {
  name: 'cvl_roleassignment_bot',
};
