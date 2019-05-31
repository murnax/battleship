const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    id: String,
    availableShips: { type: Map },
    deployedShips: { type: Map },
    board: { type: Array },
    height: { type: Number },
    weight: { type: Number },
    numberOfAttack: { type: Number }
});
const GameModel = mongoose.model('Game', gameSchema);

const { Game } = require('.');

class GameRepository {

    constructor(dbContext, gameFactory) {
        this._dbContext = dbContext;
        this._gameFactory = gameFactory;
    }

    /**
     * 
     * @param {Game} game 
     */
    create(game) {
        const gameEntityModel = new GameModel(game);
        gameEntityModel.save((err, data) => {
            if (err) throw err;
        });
    }

    /**
     *
     * @returns {Promise<Game>}
     */
    async getGameByID(id) {
        // get entity model from db context

        // reconstitute domain model by passing entity model to convert in factory 
        return await this._gameFactory.reconstitute(id);
    }

    /**
     * 
     * @param {Game} game 
     */
    async update(game) {

    }
}
module.exports = GameRepository;
