const api = 'https://e621.net/post/index.json&callback=function';

const snekfetch = module.require('snekfetch');

module.exports.run = async (client, message, args, con, config) => {
  snekfetch.get(api).then(r => console.log(r.body));
};

module.exports.help = {
  name: 'json',
};
