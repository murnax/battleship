const chai = require('chai');
// chai.use(require('chai-as-promised'));
const expect = chai.expect;

const uuid = require('uuid');
const { Game, Ship, ShipDirection, Coordinate } = require('../../../src/Game');
const { GridType } = require('../../../src/Game').Grid;
const GameService = require('../../../src/Game/GameService');
const gameID = uuid();
const game = new Game(gameID, 10, 10);
const gameRepository = {
    getGameByID: () => game,
    update: () => { }
};
const gameFactory = {};
const gameService = new GameService(gameRepository, gameFactory);

const attacker = 'ATTACKER';
const defender = 'DEFENDER';

describe('Game service', () => {

    describe('Game status', () => {

        describe('Planning phase', () => {

            describe('Defender', () => {
                it('Available water grid = 0', async () => {
                    const board = await gameService.getBoard(gameID, defender);
                    const areAllWaterGrids = board.every(n => n.every(m => m === 0));
                    expect(areAllWaterGrids).to.be.true;
                });

                it('Unavailable water grid = 1', async () => {
                    await gameService.placeShip(uuid(), 'BATTLESHIP', 5, 5, 'HORIZONTAL');
                    const board = await gameService.getBoard(gameID, defender);
                    const surroundingGrids = [ /* [y, x] */
                        [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9],
                        [5, 4], /*         ship grid        */, [5, 9],
                        [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
                    ];
                    const areAllUnavailableWaterGrids = surroundingGrids.every(n => {
                        const [y, x] = n;
                        return board[y][x] === 1;
                    });
                    expect(areAllUnavailableWaterGrids).to.be.true;
                });

                it('Unavailable ship grid = 2', async () => {
                    const board = await gameService.getBoard(gameID, defender);
                    const shipGrids = [ /* [y, x] */
                        [5, 5], [5, 6], [5, 7], [5, 8]
                    ];
                    const areAllShipGrids = shipGrids.every(n => {
                        const [y, x] = n;
                        return board[y][x] === 2;
                    });
                    expect(areAllShipGrids).to.be.true;
                });
            });

            describe('Attacker', () => {
                it('Can not access game status if game is in planning phase', async () => {
                    try {
                        await gameService.getBoard(gameID, defender)
                    } catch (error) {
                        expect(error.message).to.equal('Game is in planning phase');
                    }
                });
            });
        });

        describe('Battle phase', () => {

            before(() => {
                game.reset();

                // override available ships
                game.availableShips = {};
                game.availableShips[Ship.Type.BATTLESHIP] = 1;
                game.availableShips[Ship.Type.SUBMARINE] = 2;

                // Deploy all ships to enter battle phase
                game.placeShip(Ship.create(uuid(), Ship.Type.BATTLESHIP), new Coordinate(3, 3), ShipDirection.HORIZONTAL);
                game.placeShip(Ship.create(uuid(), Ship.Type.SUBMARINE), new Coordinate(5, 5), ShipDirection.HORIZONTAL);
                game.placeShip(Ship.create(uuid(), Ship.Type.SUBMARINE), new Coordinate(8, 8), ShipDirection.HORIZONTAL);
            });

            describe('Defender', () => {
                it('Unattacked water grid = 0', async () => {
                    const board = await gameService.getBoard(gameID, defender);
                    const unattackedWaterGrids = [].concat.apply([], game.board)
                        .filter(n => n.type === GridType.WATER && !n.isAttacked)
                        .map(n => { return { x: n.x, y: n.y } });
                    expect(unattackedWaterGrids.every(n => {
                        return board[n.y][n.x] === 0
                    })).to.be.true;
                });

                it('Attacked water grid = 1', async () => {
                    await gameService.attack(gameID, 0, 0);
                    const board = await gameService.getBoard(gameID, defender);
                    expect(board[0][0]).to.equal(1);
                });

                it('Unattacked ship grid = 2', async () => {
                    const board = await gameService.getBoard(gameID, defender);
                    const unattackedShipGrids = [].concat.apply([], game.board)
                        .filter(n => n.type === GridType.SHIP && !n.isAttacked)
                        .map(n => { return { x: n.x, y: n.y } });
                    expect(unattackedShipGrids.every(n => {
                        return board[n.y][n.x] === 2
                    })).to.be.true;
                });

                it('Attacked ship grid = 3', async () => {
                    await gameService.attack(gameID, 4, 3); // attack on battleship!
                    const board = await gameService.getBoard(gameID, defender);
                    expect(board[3][4]).to.equal(3); // [y, x]
                });

                it('Attacked ship grid and ship is sunk already = 4', async () => {
                    await gameService.attack(gameID, 5, 5); // attack on submarine!
                    const board = await gameService.getBoard(gameID, defender);
                    expect(board[5][5]).to.equal(4);
                });
            });

            describe('Attacker', () => {
                it('Unattacked grid = 0', async () => {
                    const board = await gameService.getBoard(gameID, attacker);
                    const unattackedGrids = [].concat.apply([], game.board)
                        .filter(n => !n.isAttacked)
                        .map(n => { return { x: n.x, y: n.y } });
                    expect(unattackedGrids.every(n => {
                        return board[n.y][n.x] === 0
                    })).to.be.true;
                });

                it('Attacked water grid = 1', async () => {
                    await gameService.attack(gameID, 0, 9); // bottom-left
                    const board = await gameService.getBoard(gameID, attacker);
                    expect(board[9][0]).to.equal(1); // [y, x]
                });

                it('Attacked ship grid = 2', async () => {
                    const board = await gameService.getBoard(gameID, attacker);
                    expect(board[3][4]).to.equal(2);
                });

                it('Attacked ship grid and ship is sunk already = 3', async () => {
                    await gameService.attack(gameID, 3, 3); // attack on battleship!!
                    await gameService.attack(gameID, 5, 3); // attack on battleship!!!
                    await gameService.attack(gameID, 6, 3); // attack on battleship!!!!
                    const board = await gameService.getBoard(gameID, attacker);
                    const battleShipGrids = [[3, 3], [4, 3], [5, 3], [6, 3]];
                    const isShipSunk = battleShipGrids.every(n => board[n[1]][n[0]] === 3);
                    expect(isShipSunk).to.be.true;
                });
            });
        });
    });
});