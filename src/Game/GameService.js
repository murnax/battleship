const { GameRepository, GameFactory, Game } = require('.');

class GameService {

    /**
     * 
     * @param {GameRepository} gameRepository 
     */
    constructor(gameRepository) {
        this._gameRepository = gameRepository;
    }

    async startGame() {
        const game = GameFactory.create(10, 10);
        await this._gameRepository.create(game);
    }
}
module.exports = GameService;
