const uuid = require('uuid');
const { GameRepository, GameFactory, Game, Ship, Coordinate } = require('.');

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

    async startGame() {
        const game = this._gameFactory.create(uuid(), 10, 10);
        await this._gameRepository.create(game);
    }

    /**
     * 
     */
    async placeShip(id, shipType, x, y, direction) {
        const ship = Ship.Ship.create(uuid(), shipType);
        const game = await this._gameRepository.getGameByID(id);

        game.placeShip(ship, new Coordinate(x, y), direction);
        await this._gameRepository.update(game);
    }
}
module.exports = GameService;
