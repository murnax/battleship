const { Game } = require('../');
const { GridType } = require('../').Grid;

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
        this.board = game.board.map(n => n.map(m => m.available ? 0 : m.type === GridType.SHIP ? 2 : 1));;
        // this.phase = phase;
        // this.availableShips = availableShips;
        // this.deployedShips = deployedShips;
        // this.destroyedShips = destroyedShips;
    }
}

class DefenderBattlePhase extends GameState {
    constructor(game) {
        super();
        this.board = game.board.map(n =>
            n.map(m => {
                if (m.type === GridType.WATER) {
                    return !m.isAttacked ? 0 : 1;
                } else if (m.type === GridType.SHIP) {
                    return m.ship.isSunk ? 4 : m.isAttacked ? 3 : 2;
                }
            }));;
        // this.phase = phase;
        // this.availableShips = availableShips;
        // this.deployedShips = deployedShips;
        // this.destroyedShips = destroyedShips;
    }
}

class AttackerBattlePhase extends GameState {
    constructor(game) {
        super();
        this.board = game.board.map(n =>
            n.map(m => {
                if (!m.isAttacked) return 0;
                if (m.isAttacked && m.type === GridType.WATER) return 1;
                if (m.isAttacked && m.type === GridType.SHIP) {
                    if (m.ship.isSunk) return 3;
                    return 2;
                }
            }));;
        // this.phase = phase;
        // this.availableShips = availableShips;
        // this.deployedShips = deployedShips;
        // this.destroyedShips = destroyedShips;
    }
}