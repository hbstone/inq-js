const { Logger, Config, Player } = require('ranvier');
const attributes = require('../attributes');

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = {
  event: state => {
    const startingRoomRef = Config.get('startingRoom');
    if (!startingRoomRef) {
      Logger.error('No startingRoom defined in ranvier.json');
      process.exit(1);
      return;
    }

    return async (socket, args) => {
      let player = new Player({
        name: args.name,
        account: args.account,
      });

      const defaultAttributes = attributes.map(({ name }) => name);
      for (const attr of defaultAttributes) {
        player.addAttribute(state.AttributeFactory.create(attr));
      }

      args.account.addCharacter(args.name);
      args.account.save();

      const room = state.RoomManager.getRoom(startingRoomRef);
      player.room = room;
      await state.PlayerManager.save(player);

      // reload from manager so events are set
      player = await state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    };
  }
};

