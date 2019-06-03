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

app.get('/', async (req, res, next) => {
    try {
        const { id, user_type } = req.query;
        const gameState = await gameService.getBoard(id, user_type.toUpperCase());
        res.json({
            status: 200,
            data: {
                gameState
            }
        });
    } catch (error) {
        next(error);
    }
});

app.post('/', async (req, res, next) => {
    try {
        const game = await gameService.startGame();
        res.json({
            status: 200,
            data: {
                id: game.id
            }
        });
    } catch (error) {
        next(error);
    }
});

app.post('/reset', async (req, res, next) => {
    try {
        await gameService.reset(req.body.id);
        res.json({
            status: 200,
            data: {
                message: 'Reset successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

app.post('/attack', async (req, res, next) => {
    try {
        const { id, x, y } = req.body;
        const attackResult = await gameService.attack(id, x, y);
        res.json({
            status: 200,
            data: attackResult
        });
    } catch (error) {
        next(error);
    }
});

app.post('/ship', async (req, res, next) => {
    try {
        const { id, direction, x, y, ship_type } = req.body;
        const deployedShip = await gameService.placeShip(id, ship_type, x, y, direction);
        res.json({
            status: 200,
            data: {
                message: `placed ${deployedShip.ship.type}`
            }
        });
    } catch (error) {
        next(error);
    }
});

app.use(function (error, req, res, next) {
    console.log(error.stack);
    res.status(400).json({ status: 400, message: error.message });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
