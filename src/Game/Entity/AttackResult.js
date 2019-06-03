const Coordinate = require('./Coordinate');
const { Grid, GridType } = require('./Grid');
const Ship = require('./Ship/Ship');
const Game = require('./Game');

const AttackResultType = {
    MISS: 'MISS',
    HIT: 'HIT',
    SANK: 'SANK',
    GAME_OVER: 'GAME OVER'
}

class AttackResult {

    static get Type() { return AttackResultType; }

    /**
     * 
     * @param {Grid} grid 
     * @param {Game} game
     */
    static create(grid, game) {
        const coordinate = new Coordinate(grid.x, grid.y);
        switch (grid.type) {
            case GridType.WATER:
                return new MissAttack(coordinate);
            case GridType.SHIP:
                if (game.isGameOver) {
                    return new GameOverAttack(coordinate, game);
                }

                if (grid.ship.isSunk) {
                    return new SankAttack(coordinate, grid.ship);
                } else {
                    return new HitAttack(coordinate);
                }
        }
    }

    /**
     * 
     * @param {Coordinate} coordinate 
     */
    constructor(coordinate) {
        this.coordinate = coordinate;
    }
}
module.exports = AttackResult;

class MissAttack extends AttackResult {

    /**
     * 
     * @param {Coordinate} coordinate 
     */
    constructor(coordinate) {
        super(coordinate);
        this.message = 'Miss';
        this.type = AttackResultType.MISS;
    }
}


class HitAttack extends AttackResult {
    /**
     * 
     * @param {Coordinate} coordinate 
     */
    constructor(coordinate) {
        super(coordinate);
        this.message = 'Hit'
        this.type = AttackResultType.HIT;
    }
}

class SankAttack extends AttackResult {
    /**
     * 
     * @param {Coordinate} coordinate 
     * @param {Ship} ship
     */
    constructor(coordinate, ship) {
        super(coordinate);
        this.message = `You just sank the ${ship.type}`;
        this.type = AttackResultType.SANK;
    }
}

class GameOverAttack extends AttackResult {

    /**
     * 
     * @param {Coordinate} coordinate 
     * @param {Game} game 
     */
    constructor(coordinate, game) {
        super(coordinate);
        this.message = 'Game over'
        this.totalAttack = game.totalAttack;
        this.totalMissedAttack = game.totalMissedAttack;
    }
}