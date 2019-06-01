const _ = require('lodash');
const { Game } = require('.');
const { Grid, GridType } = require('.').Grid;

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

        gameEntityModel.board = gameEntityModel.board.map(n => n.map(grid => {
            const { type, x, y, isAttacked, available } = grid;
            return Grid.create(type, x, y, isAttacked, { available });
        }));

        gameEntityModel = _.pick(gameEntityModel, Object.keys(new Game('1', 10, 10)));
        const game = Object.assign(new Game('1', 10, 10), gameEntityModel);

        return game;
    }
}
module.exports = GameFactory;