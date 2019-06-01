const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gameSchema = new Schema({
    id: String,
    availableShips: { type: Schema.Types.Mixed },
    deployedShips: { type: Schema.Types.Mixed },
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
        const entityModel = await GameModel.findOne({ id }).exec();

        // reconstitute domain model by passing entity model to convert in factory 
        return await this._gameFactory.reconstitute(entityModel);
    }

    /**
     * 
     * @param {Game} game 
     */
    async update(game) {
        await GameModel.updateOne({ id: game.id }, game).exec();
    }
}
module.exports = GameRepository;
