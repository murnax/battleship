class GameState {

    constructor(board, phase, availableShips, destroyedShips) {
        this.board = board;
        this.phase = phase;
        this.availableShips = availableShips;
        this.destroyedShips = destroyedShips;
    }
}
module.exports = GameState;