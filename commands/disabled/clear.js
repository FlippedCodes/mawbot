const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  // message.delete();
  if (isNaN(args[0])) {
    message.channel.send(`Please use a number as your arguments. \n Usage: ${config.prefix}purge <amount>`);
    return;
  }
  const fetched = await message.channel.fetchMessages({ limit: args[0] });

  for (let x = 0; x > fetched.size; x -= 100) {
    // lol
  }

  if (fetched.size >= '101') return message.channel.send('The maximum ammount allowed by Discord is 100 messages!');

  message.channel.send(fetched.size);

  // console.log(`${fetched.size} messages found, deleting...`);

  // message.channel.bulkDelete(fetched)
  //   .catch(error => message.channel.send(`Error: ${error}`) && console.log);

  // message.channel.send(`Deleted ${fetched.size} messages!`);
  // message.delete(300);
  // console.log('Deleted!');
};

module.exports.help = {
  name: 'cls',
};
