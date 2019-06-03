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

[For more details](./API-Reference.md)


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
