const uuid = require('uuid');
const { GameRepository, GameFactory, Ship, Coordinate, GameState, AttackResult } = require('.');

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
        return game;
    }

    /**
     * 
     * @param {string} id 
     * @param {string} shipType 
     * @param {number} x 
     * @param {number} y 
     * @param {string} direction 
     */
    async placeShip(id, shipType, x, y, direction) {
        const ship = Ship.create(uuid(), shipType);
        const game = await this._gameRepository.getGameByID(id);

        const deployedShip = game.placeShip(ship, new Coordinate(x, y), direction);
        await this._gameRepository.update(game);
        return deployedShip;
    }

    /**
     * Phanning phase
     * - Defender
     *   - 0: Available water grid
     *   - 1: Unavailable water grid
     *   - 2: Unavailable ship grid
     * 
     * Battle phase
     * - Defender
     *   - 0: Unattacked water grid
     *   - 1: Attacked water grid
     *   - 2: Unattacked ship grid
     *   - 3: Attacked ship grid
     *   - 4: Ship is sunk
     * - Attacker
     *   - 0: Unattacked grid
     *   - 1: Attacked water grid
     *   - 2: Attacked ship grid
     *   - 3: Attacked ship grid and sunk already
     * 
     * @param {string} id 
     * @param {string} userType 
     */
    async getBoard(id, userType) {
        const game = await this._gameRepository.getGameByID(id);
        return GameState.create(userType, game);
    }

    /**
     * 
     * @param {string} id 
     * @param {number} x 
     * @param {number} y 
     * @returns {Promise<AttackResult>}
     */
    async attack(id, x, y) {
        const game = await this._gameRepository.getGameByID(id);
        const attackResult = game.attack(new Coordinate(x, y));
        await this._gameRepository.update(game);
        return attackResult;
    }

    /**
     * 
     * @param {string} id 
     */
    async reset(id) {
        const game = await this._gameRepository.getGameByID(id);
        game.reset();
        await this._gameRepository.update(game);
    }
}
module.exports = GameService;
