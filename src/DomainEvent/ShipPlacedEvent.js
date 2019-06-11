
class ShipPlacedEvent {

    constructor(gameID, shipID, shipType, x, y, directon) {
        this.gameID = gameID;
        this.shipID = shipID;
        this.shipType = shipType;
        this.x = x;
        this.y = y;
        this.directon = directon;
    }
}
module.exports = ShipPlacedEvent;
