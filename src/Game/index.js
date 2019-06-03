// Domain models
exports.Game = require('./Entity/Game');
exports.Ship = require('./Entity/Ship/Ship');
exports.ShipDirection = require('./Entity/ShipDirection');
exports.Grid = require('./Entity/Grid');
exports.Coordinate = require('./Entity/Coordinate');
exports.AttackResult = require('./Entity/AttackResult');

// View model
exports.GameState = require('./ViewModel/GameState');

// Application and infrastructure layer modules
exports.GameRepository = require('./Repository/GameRepository');
exports.GameFactory = require('./GameFactory');
exports.GameService = require('./GameService');
