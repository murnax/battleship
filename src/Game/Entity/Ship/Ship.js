
const ShipType = {
    BATTLESHIP: 'BATTLESHIP',
    CRUISER: 'CRUISER',
    DESTROYER: 'DESTROYER',
    SUBMARINE: 'SUBMARINE'
}

class Ship {

    static get Type() { return ShipType; }

    /**
     * @param {string} id
     * @param {string} type 
     * @param {boolean} isSunk
     * @returns {Ship}
     */
    static create(id, type, isSunk = false) {
        switch (type) {
            case ShipType.BATTLESHIP:
                return new Battleship(id, isSunk);
            case ShipType.CRUISER:
                return new Cruiser(id, isSunk);
            case ShipType.DESTROYER:
                return new Destroyer(id, isSunk);
            case ShipType.SUBMARINE:
                return new Submarine(id, isSunk);
            default:
                throw new Error('Ship type is not valid');
        }
    }

    /**
     * 
     * @param {string} id
     */
    constructor(id, isSunk) {
        this.id = id;
        this.type = null;
        this.length = 0;
        this.isSunk = isSunk;

    }
}
module.exports = Ship;

class Battleship extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id, isSunk) {
        super(id, isSunk);
        this.type = ShipType.BATTLESHIP;
        this.length = 4;
    }
}

class Cruiser extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id, isSunk) {
        super(id, isSunk);
        this.type = ShipType.CRUISER;
        this.length = 3;
    }
}

class Destroyer extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id, isSunk) {
        super(id, isSunk);
        this.type = ShipType.DESTROYER;
        this.length = 2;
    }
}

class Submarine extends Ship {

    /**
     * 
     * @param {string} id 
     */
    constructor(id, isSunk) {
        super(id, isSunk);
        this.type = ShipType.SUBMARINE;
        this.length = 1;
    }
}
