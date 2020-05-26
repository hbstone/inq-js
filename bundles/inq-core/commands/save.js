const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'save',
  command: () => (args, player) => {
    player.save(() => {
      B.sayAt(player, 'Saved.');
    });
  },
};
