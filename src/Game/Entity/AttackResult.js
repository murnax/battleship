const Coordinate = require('./Coordinate');
const { Grid, GridType } = require('./Grid');
const { Ship } = require('./Ship/Ship');

const AttackResultType = {
    MISS: 'MISS',
    HIT: 'HIT',
    SANK: 'SANK'
}

class AttackResult {

    static get Type() { return AttackResultType; }

    /**
     * 
     * @param {Grid} grid 
     */
    static create(grid) {
        const coordinate = new Coordinate(grid.x, grid.y);
        switch (grid.type) {
            case GridType.WATER:
                return new MissAttack(coordinate);
            case GridType.SHIP:
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
        this.message = `You just sank ${ship.type}`;
        this.type = AttackResultType.SANK;
    }
}
