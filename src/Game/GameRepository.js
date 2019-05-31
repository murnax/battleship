const { Game } = require('./');

class GameRepository {

    constructor() {

    }

    /**
     * 
     * @param {Game} game 
     */
    create(game) {
        console.log(game);
    }


}
module.exports = GameRepository;