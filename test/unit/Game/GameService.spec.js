const chai = require('chai');
const expect = chai.expect;

describe('Game service', () => {

    describe('Game status', () => {

        describe('Planning phase', () => {

            describe('Defender', () => {
                it('Available water grid = 0', done => {
                    done();
                });

                it('Unavailable water grid = 1', done => {
                    done();
                });

                it('Unavailable ship grid = 2', done => {
                    done();
                });
            });

            describe('Attacker', () => {
                it('Can not access game status if game is in planning phase', done => {
                    done();
                });
            });
        });

        describe('Battle phase', () => {

            describe('Defender', () => {
                it('Unattacked water grid = 0', done => {
                    done();
                });

                it('Attacked water grid = 1', done => {
                    done();
                });

                it('Unattacked ship grid = 2', done => {
                    done();
                });

                it('Attacked ship grid = 3', done => {
                    done();
                });

                it('Attacked ship grid and ship is sunk already = 4', done => {
                    done();
                });
            });

            describe('Attacker', () => {
                it('Unattacked grid = 0', done => {
                    done();
                });

                it('Attacked water grid = 1', done => {
                    done();
                });

                it('Attacked ship grid = 2', done => {
                    done();
                });

                it('Attacked ship grid and ship is sunk already = 3', done => {
                    done();
                });
            });
        });
    });
});