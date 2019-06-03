const _ = require('lodash');
const { Game } = require('.');
const { Grid, GridType } = require('.').Grid;
const { Ship } = require('.').Ship;

class GameFactory {

    /**
     * @param {string} id
     * @param {number} weight
     * @param {number} height
     * @returns {Game}
     */
    create(id, weight, height) {
        return new Game(id, weight, height);
    }

    /**
     * @returns {Game}
     */
    reconstitute(gameEntityModel) {
        if (!gameEntityModel.deployedShips) gameEntityModel.deployedShips = {};
        if (!gameEntityModel.destroyedShips) gameEntityModel.destroyedShips = {};

        for (let deployedShip of Object.values(gameEntityModel.deployedShips)) {
            const { id, type, isSunk } = deployedShip.ship;
            const ship = Ship.create(id, type, isSunk);
            deployedShip.ship = ship;
            deployedShip.grids = deployedShip.grids.map(grid => {
                const { type, x, y, isAttacked } = grid;
                return Grid.create(type, x, y, isAttacked, { ship });
            });
            deployedShip.grids.forEach(grid => {
                const { x, y } = grid;
                gameEntityModel.board[y][x] = grid;
            });
        }

        gameEntityModel.board = gameEntityModel.board.map(n => n.map(grid => {
            if (grid.type === GridType.SHIP) return grid;
            const { type, x, y, isAttacked, available } = grid;
            return Grid.create(type, x, y, isAttacked, { available });
        }));

        gameEntityModel = _.pick(gameEntityModel, Object.keys(new Game('1', 10, 10)));
        const game = Object.assign(new Game('1', 10, 10), gameEntityModel);
        return game;
    }
}
module.exports = GameFactory;