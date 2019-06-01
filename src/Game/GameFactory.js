const _ = require('lodash');
const { Game } = require('.');

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
        const prototype = new Game('1', 10, 10);
        gameEntityModel = _.pick(gameEntityModel, Object.keys(prototype))
        const game = Object.assign(new Game('1', 10, 10), gameEntityModel);
        return game;
    }
}
module.exports = GameFactory;