const {
  Login,
  // Submission,
  Notifications,
} = require('furaffinity');

// TODO: Gets Added Later
// function Timeout(msg, userID, messageOwner, config) {
//   messageOwner.set(msg.id, userID);
//   setTimeout(() => {
//     messageOwner.delete(msg.id);
//     msg.clearReactions();
//   }, config.reactionsTimeout);
// }

function previewMessage(submission, Discord, config, channel) {
  let embed = new Discord.RichEmbed()
    .setAuthor(`Artist: ${submission.author.name}`)
    .setColor(config.color_fa)
    .setTitle('Furaffinity Link')
    .setURL(submission.url)
    .addField('Preview', '🔽')
    .setImage(submission.thumb.large)
    .setFooter('Furaffinity', config.logo_fa)
    .setTimestamp();
  channel.send({ embed });
}

module.exports.run = async (client, fs, config, Discord) => {
  const channel = client.channels.get(config.FApostRoom);

  if (!channel) return;

  // onetime setup
  let fa_token_A;
  let fa_token_B;
  if (fs.existsSync('./mawbot/config/test_token.json')) {
    let token = require('../config/test_token.json');
    fa_token_A = token.fa_cookie_a;
    fa_token_B = token.fa_cookie_b;
    // TODO: return for resting
  } else {
    fa_token_A = process.env.FA_COOKIE_A;
    fa_token_B = process.env.FA_COOKIE_B;
  }

  if (channel.nsfw === false) return;

  Login(fa_token_A, fa_token_B);

  // get and store newest submission
  let latestSubmission;
  Notifications().then((pool) => {
    latestSubmission = pool[0].id;
  });

  // loop
  setInterval(() => {
    // check if the newest submission is still the newest
    Notifications().then(async (pool) => {
      let i = 0;
      let hitOldStart = false;
      while (!hitOldStart) {
        // post every image until the old new subission. Stops at 10 submissions as failsafe
        if (latestSubmission === pool[i].id || i >= 10) {
          // change the new submission
          latestSubmission = pool[0].id;
          hitOldStart = true;
          return;
        }
        previewMessage(pool[i], Discord, config, channel);
        i++;
      }
    });
    // end loop with 7 min timer
  }, 1 * 420000);
  // }, 1 * 5000);
};

module.exports.help = {
  name: 'fa_notifications',
};
