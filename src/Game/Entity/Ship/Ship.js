class ShipType {
    static get BATTLESHIP() { return 'BATTLESHIP'; }
    static get CRUISER() { return 'CRUISER'; }
    static get DESTROYER() { return 'DESTROYER'; }
    static get SUBMARINE() { return 'SUBMARINE'; }
}
exports.ShipType = ShipType;

class Ship {

    /**
     * @param {string} id
     * @param {ShipType} type 
     * @returns {Ship}
     */
    static create(id, type) {
        switch (type) {
            case ShipType.BATTLESHIP:
                return new Battleship(id);
            case ShipType.CRUISER:
                return new Cruiser(id);
            case ShipType.DESTROYER:
                return new Destroyer(id);
            case ShipType.SUBMARINE:
                return new Submarine(id);
            default:
                throw new Error('Ship type is not valid');
        }
    }

    static reconstitute(id, type, isAttacked) {

    }

    /**
     * 
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
        this.type = null;
        this.length = 0;
        this.isAttacked = false;

    }
}
exports.Ship = Ship;

class Battleship extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        this.type = ShipType.BATTLESHIP;
        this.length = 4;
    }
}

class Cruiser extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        this.type = ShipType.CRUISER;
        this.length = 3;
    }
}

class Destroyer extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        this.type = ShipType.DESTROYER;
        this.length = 2;
    }
}

class Submarine extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        this.type = ShipType.SUBMARINE;
        this.length = 1;
    }
}
