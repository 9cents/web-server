# backend
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

---
## Environment Variables Explained (`.env` file)

| Variable   | Description                            |
| ---------- | -------------------------------------- |
| PORT       | Port number of server                  |
| PGHOST     | Name of host of PgSQL server           |
| PGUSER     | User name to connect to PgSQL server   |
| PGPASSWORD | Password to connect to PgSQL server    |
| PGDATABASE | PgSQL server database name             |
| PGPORT     | Port number to connect to PgSQL server |

---
## API Endpoints Examples

For example, for table `players`, the endpoints and SQL queries are as such:

##### GET
If query is specified, will translate to WHERE clause
```
GET /players
SELECT * FROM players;

GET /players?group_id=3
SELECT * FROM players WHERE group_id=3;
```

##### PUT
If `condition` field is present, will treat as `UPDATE` query; else will treat as `INSERT` query. For `INSERT` queries, be sure to include values for all fields.
```
Content-Type: application/json

PUT /players
{
  name: "John"
}
INSERT INTO players(name) VALUES('John');

PUT /players
{
  name: "John"
  condition: {
    id: "2"
  }
}
UPDATE players SET name='John' WHERE id=2;
```

##### DELETE
Must specify fields to delete on.
```
Content-Type: application/json
DELETE /players
{
  name: "Peter",
}
DELETE FROM players WHERE name='Peter';
```
