module.exports.run = async (client, servers, fs) => {
  let fa_token_A;
  let fa_token_B;
  if (fs.existsSync('./config/test_token.json')) {
    // let token = require('../config/test_token.json');
    // fa_token_A = token.fa_cookie_a;
    // fa_token_B = token.fa_cookie_b;
  } else {
    fa_token_A = process.env.FA_COOKIE_A;
    fa_token_B = process.env.FA_COOKIE_B;
  }
};

module.exports.help = {
  name: 'fa_notifications',
};
