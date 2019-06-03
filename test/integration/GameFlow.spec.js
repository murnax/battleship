const chai = require('chai');
const expect = chai.expect;
const { Game, Ship, ShipDirection, AttackResult } = require('../../src/Game');
const app = require('../../src');
const request = require('supertest')(app);
const GameService = require('./GameService')(request);

describe('Game flow', () => {
    let gameID, shipGrids;
    describe('Planning phase', () => {

        let response, gameState;
        it('Start new game', async () => {
            gameID = (await GameService.startGame()).body.data.id;
        });

        it('Deploy all ships', async () => {
            expect((await GameService.placeShip(gameID, Ship.Type.BATTLESHIP, 9, 6, ShipDirection.VERTICAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.CRUISER, 1, 1, ShipDirection.HORIZONTAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.CRUISER, 2, 3, ShipDirection.HORIZONTAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.DESTROYER, 6, 1, ShipDirection.VERTICAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.DESTROYER, 9, 2, ShipDirection.VERTICAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.DESTROYER, 1, 5, ShipDirection.HORIZONTAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.SUBMARINE, 0, 3, ShipDirection.HORIZONTAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.SUBMARINE, 4, 5, ShipDirection.HORIZONTAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.SUBMARINE, 7, 5, ShipDirection.HORIZONTAL)).status).to.equal(200);
            expect((await GameService.placeShip(gameID, Ship.Type.SUBMARINE, 0, 9, ShipDirection.HORIZONTAL)).status).to.equal(200);
        });

        it('All ships must be in the correct position', async () => {
            response = await GameService.getGameState(gameID, 'DEFENDER');
            expect(response.status).to.equal(200);

            gameState = response.body.data.gameState;
            const board = gameState.board;
            expect(board).to.deep.equal(
                [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 2, 2, 2, 0, 0, 2, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 2, 0, 0, 2],
                    [2, 0, 2, 2, 2, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 2, 2, 0, 2, 0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2]]
            );

            // Get all ship grids to destroy later!
            shipGrids = [];
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    if (board[y][x] === 2) {
                        shipGrids.push([x, y]);
                    }
                }
            }
        });

        it(`Game must be in ${Game.GamePhase.BATTLE} phase`, done => {
            expect(response.body.data.gameState.phase).to.equal(Game.GamePhase.BATTLE);
            done();
        });
    });

    describe('Battle phase', () => {
        let totalAttack = 0;
        let totalMissedAttack = 0;
        it('Attacker get game state', async () => {
            const response = await GameService.getGameState(gameID, 'ATTACKER');
            const gameState = response.body.data.gameState;
            const board = gameState.board;
            expect(board).to.deep.equal(
                [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
            );
        });

        it('Attack miss on water grid', async () => {
            let response = await GameService.attack(gameID, 0, 0);
            expect(response.status).to.equal(200);
            expect(response.body.data.type).to.equal(AttackResult.Type.MISS);

            response = await GameService.getGameState(gameID, 'ATTACKER');
            const gameState = response.body.data.gameState;
            const board = gameState.board;
            expect(board[0][0]).to.equal(1);
            totalMissedAttack++;
            totalAttack++;
        });

        it('Attack every single ships', async () => {
            for (let i = 0; i < shipGrids.length - 1; i++) {
                const [x, y] = shipGrids[i];
                const response = await GameService.attack(gameID, x, y);
                expect(response.status).to.equal(200);
                expect(response.body.data.type).to.be.oneOf([AttackResult.Type.HIT, AttackResult.Type.SANK]);
                totalAttack++;
            }
        });

        it('Attack last ship grid will result in game over response with number of total attack and missed', async () => {
            const [x, y] = shipGrids[shipGrids.length - 1];
            const response = await GameService.attack(gameID, x, y);
            const { data } = response.body;
            expect(response.status).to.equal(200);
            totalAttack++;

            expect(data.message).to.equal('Game over');
            expect(data.totalAttack).to.equal(totalAttack);
            expect(data.totalMissedAttack).to.equal(totalMissedAttack);

        });

        it('Game is over when all ships are sank', async () => {
            const response = await GameService.getGameState(gameID, 'ATTACKER');
            expect(response.body.data.gameState.phase).to.equal(Game.GamePhase.OVER);
        });
    });
});

