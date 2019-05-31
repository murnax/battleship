const { GameRepository, GameFactory } = require('.');

class GameService {

    /**
     * 
     * @param {GameRepository} gameRepository 
     * @param {GameFactory} gameFactory 
     */
    constructor(gameRepository, gameFactory) {
        this._gameRepository = gameRepository;
        this._gameFactory = gameFactory;
    }
}
module.exports = GameService;
