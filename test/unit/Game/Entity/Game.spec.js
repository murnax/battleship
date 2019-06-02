const chai = require('chai');
const expect = chai.expect;

describe('Game', () => {

    describe('Planning phase', () => {

        describe('Start new game', () => {

            it('New game must be in planning phase', done => {

            });

            it('There should not be any ship deployed', done => {

            });

            it('All grids must be water grid type', done => {

            });
        });

        describe('Placing ships', () => {

            it('When place a ship, all surrounding grids will be marked as unavailable', done => {

            });

            it('Can not place ship that no longer available', done => {

            });

            it('When all ships are deployed, game will go to battle phase', done => {

            });
        });


    });

    describe('Battle phase', () => {

        it('Game can no longer be resetted after enter battle phase', done => {

        });

        describe('Attacking', () => {

            it('When ship grid is attacked, ship grid will be marked as attacked', done => {

            });

            it('When all ship grids are attacked, ship will be marked as is sunk', done => {

            });

            it('When all ships are sunk, game will be over', done => {

            });
        });
    });
});