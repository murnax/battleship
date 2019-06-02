const ShipDirection = require('./ShipDirection');
const { Ship, ShipType } = require('./Ship/Ship');
const { Grid, GridType } = require('./Grid');
const DeployedShip = require('./DeployedShip');
const Coordinate = require('./Coordinate');

const GamePhase = {
    PLANNING: 'PLANNING',
    BATTLE: 'BATTLE',
    OVER: 'OVER'
};

class Game {

    get isPlanningPhase() { return this.phase === GamePhase.PLANNING };
    get isBattlePhase() { return this.phase === GamePhase.BATTLE };
    get isGameOver() { return this.phase === GamePhase.OVER };

    /**
     * @param {string} id
     * @param {number} weight
     * @param {number} height 
     */
    constructor(id, weight, height) {
        this.id = id;
        this.totalAttack = 0;
        this.totalMissedAttack = 0;
        this.weight = weight;
        this.height = height;
        this.board = this._generateGrid(this.weight, this.height);
        this.availableShips = {};
        this.availableShips[ShipType.BATTLESHIP] = 1;
        this.availableShips[ShipType.CRUISER] = 2;
        this.availableShips[ShipType.DESTROYER] = 3;
        this.availableShips[ShipType.SUBMARINE] = 4;
        this.deployedShips = {};
        this.destroyedShips = {};
        this.phase = GamePhase.PLANNING;
    }

    _generateGrid(weight, height) {
        let board = [];
        for (let i = 0; i < weight; i++) {
            board[i] = [];
            for (let j = 0; j < height; j++) {
                board[i][j] = Grid.create(GridType.WATER, i, j, false, { available: true });
            }
        }
        return board;
    }

    /**
     * Steps for placing ship on the board:
     * - check whether ship is still available to deploy or not
     *   - throw error if ship type is no longer available
     * - get all grids required to place a ship from a given parameters
     *   - throw error if any ship grid exceeds board boundary
     * - check whether all grids are available
     * - detach ship from available ships map
     * - attach ship to deployed ships map
     * - attach ship grids to the board matrix
     * - mark all surrounding grids as unavailable
     * 
     * 
     * @param {Ship} ship 
     * @param {Coordinate} coordinate
     * @param {*} direction 
     */
    placeShip(ship, coordinate, direction) {
        if (!this.isPlanningPhase) {
            throw new Error('Game is not in planning phase');
        }

        const { x, y } = coordinate;

        if (!(ship.type in this.availableShips)) {
            throw new Error(`No ${ship.type} ship available to deploy`);
        }

        const shipGrids = this.getShipGrids(ship, coordinate, direction);

        // Check ship's grids validity
        if (!this._areAllGridsValidToPlaceShip(shipGrids)) {
            throw new Error('invalid grid');
        }

        // Place ship in the board
        for (let grid of shipGrids) {
            const { x, y } = grid;
            this.board[y][x] = grid;
        }

        // Attach ship to deployed map        
        this.deployedShips[ship.id] = new DeployedShip(ship, shipGrids);

        // Detach ship from available map
        --this.availableShips[ship.type] === 0 && delete this.availableShips[ship.type];

        // Mark all surrounding grids as unavailable
        if (direction === ShipDirection.HORIZONTAL) {
            for (let i = x - 1; i < x + ship.length + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (i < 0 || j < 0) continue;
                    this.board[j][i].available = false;
                }
            }
        } else if (direction === ShipDirection.VERTICAL) {
            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j < y + ship.length + 1; j++) {
                    if (i < 0 || j < 0) continue;
                    this.board[j][i].available = false;
                }
            }
        }

        // Go battle phase if all ships have been deployed
        if (!Object.keys(this.availableShips).length) this.phase = GamePhase.BATTLE;
    }

    /**
     * 
     * @param {Array<Grid>} grids 
     */
    _areAllGridsValidToPlaceShip(grids) {
        for (let grid of grids) {
            const { x, y } = grid;
            if (!this.board[y][x].available) return false;
        }
        return true;
    }

    /**
     * 
     * @param {Ship} ship 
     * @param {Coordinate} coordinate
     * @param {*} direction 
     * @return {Array<Grid>}
     */
    getShipGrids(ship, coordinate, direction) {
        const { x, y } = coordinate;
        if (this._exceedBoardBoundary(coordinate, ship.length, direction)) {
            throw new Error('Ship\'s grids exceed boundary');
        }

        const length = ship.length;
        const grids = [];
        if (direction === ShipDirection.HORIZONTAL) {
            for (let i = 0; i < length; i++) {
                grids.push(Grid.create(GridType.SHIP, x + i, y, false, { ship }));
            }
        } else if (direction === ShipDirection.VERTICAL) {
            for (let i = 0; i < length; i++) {
                grids.push(Grid.create(GridType.SHIP, x, y + i, false, { ship }));
            }
        }
        return grids;
    }

    _exceedBoardBoundary(coordinate, length, direction) {
        const { x, y } = coordinate;
        if ((direction === ShipDirection.HORIZONTAL &&
            x + length > this.weight) ||
            (direction === ShipDirection.VERTICAL &&
                y + length > this.height)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {Coordinate} coordinate
     */
    attack(coordinate) {
        if (!this.isBattlePhase) {
            throw new Error('Game is not in battle phase');
        }

        const { x, y } = coordinate;
        const grid = this.board[y][x];
        console.log(`\nAttacking to x: ${grid.x}, y: ${grid.y}`);
        if (grid.isAttacked) {
            throw new Error('Grid is already attacked');
        }

        if (grid.type === GridType.SHIP) {
            const deployedShip = this.deployedShips[grid.ship.id];
            console.log(`Hit!`);
            grid.attack();

            if (deployedShip.grids.every(n => n.isAttacked)) {
                console.log(`Sank ${grid.ship.type}`);
                deployedShip.ship.isSunk = true;
                this.destroyedShips[grid.ship.id] = deployedShip;
                delete this.deployedShips[grid.ship.id];
                if (!Object.keys(this.deployedShips).length) {
                    this.phase = GamePhase.OVER;
                }
            }
        } else if (grid.type === GridType.WATER) {
            console.log('Miss!');
            this.totalMissedAttack++;
        }
        grid.attack();
        this.totalAttack++;
    }

    reset() {
        this.totalAttack = 0;
        this.board = this._generateGrid(this.weight, this.height);
        this.availableShips = {};
        this.availableShips[ShipType.BATTLESHIP] = 1;
        this.availableShips[ShipType.CRUISER] = 2;
        this.availableShips[ShipType.DESTROYER] = 3;
        this.availableShips[ShipType.SUBMARINE] = 4;
        this.deployedShips = {};
        this.phase = GamePhase.PLANNING;
    }
}
module.exports = Game;
