const uuid = require('uuid');
const { GameRepository, GameFactory, Game, Ship, Coordinate, GameState } = require('.');
const { GridType } = require('.').Grid;

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
        let board;
        if (userType === 'ATTACKER') {
            if (game.isPlanningPhase) {
                throw new Error('Game is in planning phase');
            }
            board = game.board.map(n =>
                n.map(m => {
                    if (!m.isAttacked) return 0;
                    if (m.isAttacked && m.type === GridType.WATER) return 1;
                    if (m.isAttacked && m.type === GridType.SHIP) {
                        if (m.ship.isSunk) return 3;
                        return 2;
                    }
                }));
        } else if (userType === 'DEFENDER') {
            if (game.isBattlePhase) {
                board = game.board.map(n =>
                    n.map(m => {
                        if (m.type === GridType.WATER) {
                            return !m.isAttacked ? 0 : 1;
                        } else if (m.type === GridType.SHIP) {
                            return m.ship.isSunk ? 4 : m.isAttacked ? 3 : 2;
                        }
                    }));
            } else if (game.isPlanningPhase) {
                board = game.board.map(n => n.map(m => m.available ? 0 : m.type === GridType.SHIP ? 2 : 1));
            }
        }

        // console.log(board);

        return new GameState(board, game.phase, game.availableShips, game.destroyedShips);
    }

    async attack(id, x, y) {
        const game = await this._gameRepository.getGameByID(id);
        const attackResult = game.attack(new Coordinate(x, y));
        await this._gameRepository.update(game);
        return attackResult;
    }

    async reset(id) {
        const game = await this._gameRepository.getGameByID(id);
        game.reset();
        await this._gameRepository.update(game);
    }
}
module.exports = GameService;
