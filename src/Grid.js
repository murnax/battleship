const { Ship } = require('./Entity/Ship/Ship');

class GridType {
    static get WATER() { return 'WATER'; }
    static get SHIP() { return 'SHIP'; }
}
exports.GridType = GridType;

class Grid {

    /**
     * 
     * @param {GridType} type 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} isAttacked
     * @param {any} options 
     */
    static create(type, x, y, isAttacked, options) {
        switch (type) {
            case GridType.SHIP:
                return new ShipGrid(x, y, isAttacked, options.ship);
            case GridType.WATER:
                return new WaterGrid(x, y, isAttacked, options.available);
        }
    }

    get isAvailable() { return this.available; }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} isAttacked
     * @param {boolean} available
     */
    constructor(x, y, isAttacked, available) {
        this.x = x;
        this.y = y;
        this.isAttacked = isAttacked;
        this.available = available;
        this.type = GridType.WATER;
    }

    attack() {
        this.isAttacked = true;
    }
}
exports.Grid = Grid;

class WaterGrid extends Grid {
}

class ShipGrid extends Grid {

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {boolean} isAttacked
     * @param {Ship} ship
     */
    constructor(x, y, isAttacked, ship) {
        super(x, y, isAttacked, false);
        this.ship = ship;
        this.type = GridType.SHIP;
    }
}