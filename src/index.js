const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/battleship', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const { GameService, GameRepository, GameFactory } = require('./Game');
const gameFactory = new GameFactory();
const gameService = new GameService(new GameRepository(null, gameFactory), gameFactory);

app.get('/', async (req, res) => {
    const { id, user_type } = req.query;
    const board = await gameService.getBoard(id, user_type.toUpperCase());
    res.json({
        status: 200,
        data: {
            board
        }
    });
});

app.post('/', async (req, res) => {
    const game = await gameService.startGame();
    res.json({
        status: 200,
        data: {
            id: game.id
        }
    });
});

app.post('/reset', async (req, res) => {
    await gameService.reset(req.body.id);
    res.json({
        status: 200
    });
});

app.post('/attack', async (req, res) => {
    const { id, x, y } = req.body;
    await gameService.attack(id, x, y);
    res.json('ok');
});

app.post('/ship', async (req, res) => {
    const { id, direction, x, y, ship_type } = req.body;
    await gameService.placeShip(id, ship_type, x, y, direction);
    res.json({ ok: 1 });
});

app.use(logErrors);
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

app.listen(port, () => console.log(`App listening on port ${port}`));
