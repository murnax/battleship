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

    constructor(game) {
        this.phase = game.phase;
    }
}
module.exports = GameState;

class DefenderPlanningPhase extends GameState {

    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game);
        this.board = game.board.map(n => n.map(m => m.available ? 0 : m.type === GridType.SHIP ? 2 : 1));;
        this.availableShips = game.availableShips;
        this.deployedShips = game.deployedShips;
        this.destroyedShips = game.destroyedShips;
        this.totalAttack = game.totalAttack;
        this.totalMissedAttack = game.totalMissedAttack;
    }
}

class DefenderBattlePhase extends GameState {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game);
        this.board = game.board.map(n =>
            n.map(m => {
                if (m.type === GridType.WATER) {
                    return !m.isAttacked ? 0 : 1;
                } else if (m.type === GridType.SHIP) {
                    return m.ship.isSunk ? 4 : m.isAttacked ? 3 : 2;
                }
            }));
        this.availableShips = game.availableShips;
        this.deployedShips = game.deployedShips;
        this.destroyedShips = game.destroyedShips;
    }
}

class AttackerBattlePhase extends GameState {

    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game);
        this.board = game.board.map(n =>
            n.map(m => {
                if (!m.isAttacked) return 0;
                if (m.isAttacked && m.type === GridType.WATER) return 1;
                if (m.isAttacked && m.type === GridType.SHIP) {
                    if (m.ship.isSunk) return 3;
                    return 2;
                }
            }));

        this.deployedShips = {};
        for (let deployedShipID of Object.keys(game.deployedShips)) {
            this.deployedShips[deployedShipID] = {
                ship: game.deployedShips[deployedShipID].ship
            }
        }
        this.destroyedShips = game.destroyedShips;
    }
}