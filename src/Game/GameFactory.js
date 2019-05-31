const { Game } = require('.');

class GameFactory {

    /**
     * @param {number} weight
     * @param {number} height
     * @returns {Game}
     */
    static create(weight, height) {
        return new Game(weight, height);
    }

    static reconstitute() {

    }
}
module.exports = GameFactory;