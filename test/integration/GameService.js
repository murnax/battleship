const request = require('supertest')('localhost:3000');

const GameService = {
    startGame: () => {
        return request.post('/');
    },

    placeShip: (id, ship_type, x, y, direction) => {
        return request.post('/ship')
            .send({ id, ship_type, x, y, direction });
    },

    getGameState: (id, userType) => {
        return request.get(`?id=${id}&user_type=${userType}`);
    },

    attack: (id, x, y) => {
        return request.post('/attack')
            .send({ id, x, y });
    }
};
module.exports = GameService