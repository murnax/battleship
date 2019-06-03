const chai = require('chai');
const expect = chai.expect;

const uuid = require('uuid');
const { Game, Grid, ShipDirection, Coordinate } = require('../../../../src/Game');
const { GridType } = require('../../../../src/Game').Grid;
const { Ship, ShipType } = require('../../../../src/Game').Ship;

describe('Game', () => {

    describe('Planning phase', () => {
        const game = new Game(uuid(), 10, 10);

        describe('Start new game', () => {
            it('New game must be in planning phase', done => {
                expect(game.phase).to.equal(Game.GamePhase.PLANNING);
                done();
            });

            it('There should not be any ship deployed', done => {
                expect(Object.keys(game.deployedShips)).lengthOf(0);
                done();
            });

            it('All grids must be water grid type', done => {
                const areAllWaterGrids = game.board.every(n => n.every(m => m.type === GridType.WATER));
                expect(areAllWaterGrids).to.be.true;
                done();
            });

            describe('Ships available to deploy', () => {
                it('One battleship', done => {
                    expect(game.availableShips[ShipType.BATTLESHIP]).to.equal(1);
                    done();
                });

                it('Two cruiser', done => {
                    expect(game.availableShips[ShipType.CRUISER]).to.equal(2);
                    done();
                });

                it('Three destroyer', done => {
                    expect(game.availableShips[ShipType.DESTROYER]).to.equal(3);
                    done();
                });

                it('Four submarine', done => {
                    expect(game.availableShips[ShipType.SUBMARINE]).to.equal(4);
                    done();
                });
            });
        });

        describe('Placing ships', () => {

            it('When place a ship, all surrounding grids will be marked as unavailable', done => {
                const ship = Ship.create(uuid(), ShipType.BATTLESHIP);
                const coordinate = new Coordinate(5, 5);
                game.placeShip(ship, coordinate, ShipDirection.HORIZONTAL);
                const surroundingGrids = [ /* [y, x] */
                    [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9],
                    [5, 4], /*         ship grid        */, [5, 9],
                    [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
                ];
                const areAllGridsUnavailable = surroundingGrids.every(n => {
                    const [y, x] = n;
                    return !game.board[y][x].available;
                });
                expect(areAllGridsUnavailable).to.be.true;
                done();
            });

            it('After deployed, available ships of that type will be decrease and be removed when become zero', done => {
                expect(game.availableShips[ShipType.BATTLESHIP]).to.be.undefined;
                done();
            });

            it('Can not place ship that no longer available', done => {
                const ship = Ship.create(uuid(), ShipType.BATTLESHIP);
                const coordinate = new Coordinate(0, 0);
                expect(() => {
                    game.placeShip(ship, coordinate, ShipDirection.VERTICAL);
                })
                    .to.throw(Error)
                    .includes({
                        message: `No ${ShipType.BATTLESHIP} ship available to deploy`
                    });
                done();
            });

            it('Can not place ship on unavailable grid', done => {
                const ship = Ship.create(uuid(), ShipType.CRUISER);
                const coordinate = new Coordinate(4, 6);
                expect(() => {
                    game.placeShip(ship, coordinate, ShipDirection.HORIZONTAL)
                })
                    .to.throw(Error)
                    .includes({
                        message: 'invalid grid'
                    });
                done();
            });

            describe('Can not place ship that exceed board boundary', () => {
                it('Exceed bottom-right boundary', done => {
                    const ship = Ship.create(uuid(), ShipType.CRUISER);
                    const coordinate = new Coordinate(8, 8);
                    expect(() => {
                        game.placeShip(ship, coordinate, ShipDirection.HORIZONTAL)
                    })
                        .to.throw(Error)
                        .includes({
                            message: 'Ship\'s grids exceed boundary'
                        });
                    done();
                });

                it('Exceed bottom-left boundary', done => {
                    const ship = Ship.create(uuid(), ShipType.CRUISER);
                    const coordinate = new Coordinate(0, 8);
                    expect(() => {
                        game.placeShip(ship, coordinate, ShipDirection.VERTICAL)
                    })
                        .to.throw(Error)
                        .includes({
                            message: 'Ship\'s grids exceed boundary'
                        });
                    done();
                });

                it('Exceed top-right boundary', done => {
                    const ship = Ship.create(uuid(), ShipType.CRUISER);
                    const coordinate = new Coordinate(8, 0);
                    expect(() => {
                        game.placeShip(ship, coordinate, ShipDirection.HORIZONTAL)
                    })
                        .to.throw(Error)
                        .includes({
                            message: 'Ship\'s grids exceed boundary'
                        });
                    done();
                });
            });
        });
    });

    describe('Battle phase', () => {
        const game = new Game(uuid(), 10, 10);

        before(() => {
            // override available ships
            game.availableShips = {};
            game.availableShips[ShipType.BATTLESHIP] = 1;
            game.availableShips[ShipType.SUBMARINE] = 2;
        });

        it('When all ships are deployed, game will go to battle phase', done => {
            game.placeShip(Ship.create(uuid(), ShipType.BATTLESHIP), new Coordinate(0, 0), ShipDirection.HORIZONTAL);
            game.placeShip(Ship.create(uuid(), ShipType.SUBMARINE), new Coordinate(4, 4), ShipDirection.HORIZONTAL);
            game.placeShip(Ship.create(uuid(), ShipType.SUBMARINE), new Coordinate(8, 8), ShipDirection.HORIZONTAL);
            expect(game.isBattlePhase).to.be.true;
            done();
        });

        it('Game can no longer be resetted after enter battle phase', done => {
            expect(() => {
                game.reset()
            })
                .to.throws(Error)
                .includes({
                    message: 'Game is not in planning phase'
                });
            done();
        });

        describe('Attacking', () => {

            it('When water grid is attacked, water grid will be marked as attacked', done => {
                done();
            });

            it('Can not attack on attacked-grids', done => {
                done();
            });

            it('When ship grid is attacked, ship grid will be marked as attacked', done => {
                done();
            });

            it('When all ship grids are attacked, ship will be marked as is sunk', done => {
                done();
            });

            it('When all ships are sunk, game will be over', done => {
                done();
            });


        });
    });
});