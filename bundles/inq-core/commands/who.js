const { Broadcast: B } = require('ranvier');

function getRoleString(role = 0) {
  return [
    '         ',
    '<white>[Builder]</white>',
    '<b><white>  [Admin]</white></b>',
  ][role] || '';
}

module.exports = {
  usage: 'who',
  command: state => (args, player) => {
    B.sayAt(player, `Players connected: ${state.PlayerManager.players.size}`);
    B.sayAt(player, ``);
    state.PlayerManager.players.forEach(({ name, role }) => {
      B.sayAt(player, `  ${getRoleString(role)} ${name}`);
    });
  },
};
