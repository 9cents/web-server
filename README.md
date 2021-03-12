# backend
---
## Pre-Requisites

1. PostgreSQL database
2. This project's [backend server](https://github.com/9cents/backend)

---
## Installation

`npm install`

---
## How to Run

Create a `.env` file using values found in [`.env.example`](#environment-variables-explained-env-file)

To run server:

`npm run start`

To run server in development mode:

`npm run start:dev`

To test server:

`npm test`

---
<!-- ## Environment Variables Explained (`.env` file)

| Variable   | Description                            |
| ---------- | -------------------------------------- |
| PORT       | Port number of server                  |
| PGHOST     | Name of host of PgSQL server           |
| PGUSER     | User name to connect to PgSQL server   |
| PGPASSWORD | Password to connect to PgSQL server    |
| PGDATABASE | PgSQL server database name             |
| PGPORT     | Port number to connect to PgSQL server |

--- -->
## PostgreSQL Connection Configuration

This project uses [node-postgres](https://node-postgres.com) to connect to the PostgreSQL database.

The connection configuration can be found and changed in [src/database/db.config.js](src/database/db.config.js).

---
## API Examples for CRUD of most resources

For example, for table `player`, the endpoints and SQL queries are as such:

##### GET
If query is specified, will translate to WHERE clause
```
GET /player
SELECT * FROM player;

GET /player?player_id=3
SELECT * FROM player WHERE player_id=3;
```

##### PUT
If `condition` field is present, will treat as `UPDATE` query; else will treat as `INSERT` query. For `INSERT` queries, be sure to include values for all fields.
```
Content-Type: application/json

PUT /player
{
  player_name: "John"
}
INSERT INTO player(player_name) VALUES('John');

PUT /player
{
  player_name: "John"
  condition: {
    player_id: "2"
  }
}
UPDATE player SET player_name='John' WHERE player_id=2;
```

##### DELETE
Must specify fields to delete on.
```
Content-Type: application/json
DELETE /player
{
  player_name: "Peter",
}
DELETE FROM player WHERE player_name='Peter';
```
---
## Other API Endpoints can be found in [API Lists.md](API%20Lists.md) 
