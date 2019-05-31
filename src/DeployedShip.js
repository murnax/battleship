const { Ship } = require('./Entity/Ship/Ship');
const { Grid } = require('./Grid');

class DeployedShip {

    /**
     * 
     * @param {Ship} ship 
     * @param {Array<Grid>} grids 
     */
    constructor(ship, grids) {
        this.ship = ship;
        this.grids = grids;
    }
}
module.exports = DeployedShip;