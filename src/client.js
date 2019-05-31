const uuid = require('uuid');

const { Game, ShipDirection, Coordinate } = require('./Game');
const { Ship, ShipType } = require('./Game').Ship;
const { Grid, GridType } = require('./Game').Grid;

const game = new Game(10, 10);

const ship = Ship.create(uuid(), ShipType.BATTLESHIP);
const shipB = Ship.create(uuid(), ShipType.CRUISER);
const shipC = Ship.create(uuid(), ShipType.CRUISER);
const shipD = Ship.create(uuid(), ShipType.DESTROYER);
const shipE = Ship.create(uuid(), ShipType.SUBMARINE);
const shipF = Ship.create(uuid(), ShipType.SUBMARINE);

// const grid = Grid.create(GridType.SHIP, new Coordinate(3, 3), false, { ship });
game.placeShip(ship, new Coordinate(0, 4), ShipDirection.VERTICAL);
game.placeShip(shipB, new Coordinate(4, 2), ShipDirection.HORIZONTAL);
game.placeShip(shipC, new Coordinate(0, 0), ShipDirection.HORIZONTAL);
game.placeShip(shipD, new Coordinate(2, 4), ShipDirection.HORIZONTAL);
game.placeShip(shipE, new Coordinate(0, 2), ShipDirection.HORIZONTAL);
game.placeShip(shipF, new Coordinate(2, 2), ShipDirection.HORIZONTAL);

const defenderViewDeployPhase = game.board.map(n => n.map(m => m.available ? 0 : m.type === GridType.SHIP ? 2 : 1));
// console.log('defenderViewDeployPhase');
// console.log(defenderViewDeployPhase);

game.attack(new Coordinate(0, 0));
game.attack(new Coordinate(1, 1));
const defenderViewBattlePhase = game.board.map(n =>
    n.map(m =>
        m.type === GridType.WATER ? !m.isAttacked ? 0 : 1 : !m.isAttacked ? 2 : 3
    ));
console.log('defenderViewBattlePhase');
console.log(defenderViewBattlePhase);

// console.log(game.deployedShips);

// game.attack(1, 1);