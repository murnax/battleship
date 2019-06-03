const { Game } = require('../');

class GameState {

    /**
     * 
     * @param {string} userType 
     * @param {Game} game 
     */
    static create(userType, game) {
        switch (userType) {
            case 'ATTACKER':
                return new AttackerBattlePhase(game)
            case 'DEFENDER':
                return game.phase === Game.GamePhase.BATTLE ? new DefenderBattlePhase(game) : new DefenderPlanningPhase(game);
        }
    }
}
module.exports = GameState;

class DefenderPlanningPhase extends GameState {

    constructor(game) {
        super();
        this.board = board;
        this.phase = phase;
        this.availableShips = availableShips;
        this.deployedShips = deployedShips;
        this.destroyedShips = destroyedShips;
    }
}

class DefenderBattlePhase extends GameState {
    constructor(game) {
        super();
        this.board = board;
        this.phase = phase;
        this.availableShips = availableShips;
        this.deployedShips = deployedShips;
        this.destroyedShips = destroyedShips;
    }
}

class AttackerBattlePhase extends GameState {
    constructor(game) {
        super();
        this.board = board;
        this.phase = phase;
        this.availableShips = availableShips;
        this.deployedShips = deployedShips;
        this.destroyedShips = destroyedShips;
    }
}