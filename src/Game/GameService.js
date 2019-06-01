const uuid = require('uuid');
const { GameRepository, GameFactory, Game, Ship, Coordinate } = require('.');
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
        const ship = Ship.Ship.create(uuid(), shipType);
        const game = await this._gameRepository.getGameByID(id);

        game.placeShip(ship, new Coordinate(x, y), direction);
        await this._gameRepository.update(game);
    }

    async getBoard(id, userType) {
        const game = await this._gameRepository.getGameByID(id);

        if (userType === 'ATTACKER') {
            if (game.isBattlePhase) {
                throw new Error('Game is not in battle phase');
            }
        } else if (userType === 'DEFENDER') {
            if (game.isBattlePhase) {
                return game.board.map(n =>
                    n.map(m =>
                        m.type === GridType.WATER ? !m.isAttacked ? 0 : 1 : !m.isAttacked ? 2 : 3
                    ));
            } else if (game.isPlanningPhase) {
                return game.board.map(n => n.map(m => m.available ? 0 : m.type === GridType.SHIP ? 2 : 1));
            }
        }

        const defenderViewDeployPhase = game.board.map(n => n.map(m => m.available ? 0 : m.type === GridType.SHIP ? 2 : 1));
        console.log(defenderViewDeployPhase);

        return defenderViewDeployPhase;
    }

    async attack(id, x, y) {
        const game = await this._gameRepository.getGameByID(id);
        game.attack(new Coordinate(x, y));
        await this._gameRepository.update(game);
    }

    async reset(id) {
        const game = await this._gameRepository.getGameByID(id);
        game.reset();
        await this._gameRepository.update(game);
    }
}
module.exports = GameService;
