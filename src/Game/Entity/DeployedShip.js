const Ship = require('./Ship/Ship');
const { Grid } = require('./Grid');

class DeployedShip {

    /**
     * 
     * @param {Ship} ship 
     * @param {Array<Grid>} grids 
     */
    constructor(ship, grids) {

        /** @type {Ship} */
        this.ship = ship;
        /** @type {Array<Grid>} */
        this.grids = grids;
    }
}
module.exports = DeployedShip;