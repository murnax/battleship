# Battleship

Node.js backend API for Battleship game.

## Getting Started

### Prerequisites

* MongoDB  running locally

_Or if you have docker running locally:_ ```docker run --name battleship-db -p 27017:27017 mongo```

### Installing dependencies

```
npm install
```

### API Endpoints

| Endpoint              | Method    | Description                                            |
|-----------            |-----------|-------------                                           |
| /                     | POST      | Create new game.                                       |
| /                     | GET       | ​Get the current state of the ocean and the fleet.      |
| /ship                 | POST      | ​Place a single ship into the ocean.                    |
| /reset                | POST      | Reset the game to an initial state.                    |
| /attack               | POST      | Attack to a specific target on the ocean.              |

### Create new game

#### Example Request:

<i>POST: /</i>

#### Example Response:

````
{
    "status": 200,
    "data": {
        "id": "{$GAME_ID}"
    }
}
````

### Get the current state of the ocean and the fleet

#### Example Request:

<i>GET: /?id={$GAME_ID}&user_type={attacker|defender}</i>

#### Example Response:
````
{
    "status": 200,
    "data": {
        "gameState": {
            "phase": "PLANNING",
            "board": [
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ],
            "availableShips": {
                "BATTLESHIP": 1,
                "CRUISER": 2,
                "DESTROYER": 3,
                "SUBMARINE": 4
            },
            "deployedShips": {},
            "destroyedShips": {},
            "totalAttack": 0,
            "totalMissedAttack": 0
        }
    }
}
````

### Place a single ship into the ocean

#### Example Request:

<i>POST: /ship</i>
````
{
    "id": "{$GAME_ID}",
    "direction": "VERTICAL",
    "x": 3,
    "y": 4,
    "ship_type": "BATTLESHIP"
}
````

#### Example Response:

````
{
    "status": 200,
    "data": {
        "message": "placed BATTLESHIP"
    }
}
````

### Reset the game to an initial state

#### Example Request:

<i>POST: /reset</i>
````
{
	"id": "{$GAME_ID}"
}
````

#### Example Response:

````
{
    "status": 200,
    "data": {
        "message": "Reset successfully"
    }
}
````

### Attack to a specific target on the ocean

#### Example Request:

<i>POST: /attack</i>
````
{
	"id": "{$GAME_ID}",
	"x": 9,
	"y": 9
}
````

#### Example Response:

````
{
    "status": 200,
    "data": {
        "coordinate": {
            "x": 9,
            "y": 9
        },
        "message": "Miss",
        "type": "MISS"
    }
}
````


## Running the tests

Unit test

```
npm run test:unit
```

Integration test (Set of API calls from beginning to end game)

```
npm run test:integration
```

Run all tests

```
npm test
```

## Development

```
npm run dev
```
