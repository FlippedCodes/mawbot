module.exports.run = async (reaction, requester, user, con) => {
  con.query(`SELECT * FROM prune WHERE id = '${requester.id}'`, (err, rows) => {
    if (err) throw err;

    if (rows.length < 1) {
      con.query(`INSERT INTO prune (id) VALUE ('${requester.id}')`);
      requester.send('You will remain on the server until the next prune.');
    } else {
      requester.send('You are already on the list!');
    }
    reaction.remove(user);
  });
};

module.exports.help = {
  name: 'reaction_saveme',
};
