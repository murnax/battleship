const chai = require('chai');
const expect = chai.expect;

const uuid = require('uuid');
const { Game, Grid, ShipDirection, Coordinate, AttackResult } = require('../../../../src/Game');
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

            it('Board size is 10 * 10', done => {
                expect(game.weight).to.equal(10);
                expect(game.height).to.equal(10);
                done();
            });

            it('All grids must be water grid type', done => {
                const areAllWaterGrids = game.board.every(n => n.every(m => m.type === GridType.WATER));
                expect(areAllWaterGrids).to.be.true;
                done();
            });

            it('There should not be any ship deployed', done => {
                expect(Object.keys(game.deployedShips)).lengthOf(0);
                done();
            });

            it('There should not be any ship destroyed', done => {
                expect(Object.keys(game.destroyedShips)).lengthOf(0);
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
            let firstShipID = uuid();
            it('When place a ship, all surrounding grids will be marked as unavailable', done => {
                const ship = Ship.create(firstShipID, ShipType.BATTLESHIP);
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

            it('After deployed, ship will be add to deployed ships map', done => {
                expect(game.deployedShips[firstShipID]).to.exist;
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

            it('Can not attack if game is not in battle phase', done => {
                expect(() => {
                    game.attack(new Coordinate(0, 1));
                })
                    .to.throws(Error)
                    .includes({
                        message: 'Game is not in battle phase'
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
        const battleShip = Ship.create(uuid(), ShipType.BATTLESHIP);

        before(() => {
            // override available ships
            game.availableShips = {};
            game.availableShips[ShipType.BATTLESHIP] = 1;
            game.availableShips[ShipType.SUBMARINE] = 2;
        });

        it('When all ships are deployed, game will go to battle phase', done => {
            game.placeShip(battleShip, new Coordinate(0, 0), ShipDirection.HORIZONTAL);
            game.placeShip(Ship.create(uuid(), ShipType.SUBMARINE), new Coordinate(4, 4), ShipDirection.HORIZONTAL);
            game.placeShip(Ship.create(uuid(), ShipType.SUBMARINE), new Coordinate(8, 8), ShipDirection.HORIZONTAL);
            expect(game.isBattlePhase).to.be.true;
            done();
        });

        it('Can not place ship if game is not in planning phase', done => {
            expect(() => {
                game.placeShip(Ship.create(uuid(), ShipType.CRUISER), new Coordinate(8, 8), ShipDirection.HORIZONTAL);
            })
                .to.throws(Error)
                .includes({
                    message: 'Game is not in planning phase'
                });
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

            it('Attack on water will result as miss attack', done => {
                const attackResult = game.attack(new Coordinate(3, 3));
                expect(attackResult.type).to.equal(AttackResult.Type.MISS);
                done();
            });

            it('Can not attack on attacked-grids', done => {
                expect(() => {
                    game.attack(new Coordinate(3, 3));
                })
                    .to.throws(Error)
                    .includes({
                        message: 'Grid is already attacked'
                    });
                done();
            });

            it('Attack on ship will result as hit attack', done => {
                const attackResult = game.attack(new Coordinate(0, 0));
                expect(attackResult.type).to.equal(AttackResult.Type.HIT);
                done();
            });

            it('When all ship grids are attacked, ship will be marked as is sunk and sank attack will be returned', done => {
                game.attack(new Coordinate(1, 0));
                game.attack(new Coordinate(2, 0));
                const attackResult = game.attack(new Coordinate(3, 0));
                expect(attackResult.type).to.equal(AttackResult.Type.SANK);
                done();
            });

            it('Sank ship will be moved from deployed map to destroyed map', done => {
                const battleShipID = battleShip.id;
                expect(game.deployedShips).to.not.have.property(battleShipID);
                expect(game.destroyedShips).to.have.property(battleShipID);
                done();
            });

            it('When all ships are sunk, game will be over', done => {
                game.attack(new Coordinate(4, 4));
                game.attack(new Coordinate(8, 8));
                expect(game.isGameOver).to.be.true;
                done();
            });
        });
    });
});