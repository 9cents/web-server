# backend

## Installation

`npm install`

## How to Run

Create a `.env` file using values found in [`.env.example`](#environment-variables-explained-env-file)

To run server:

`npm run start`

To run server in development mode:

`npm run start:dev`

## Environment Variables Explained (`.env` file)

| Variable   | Description                            |
| ---------- | -------------------------------------- |
| PORT       | Port number of server                  |
| PGHOST     | Name of host of PgSQL server           |
| PGUSER     | User name to connect to PgSQL server   |
| PGPASSWORD | Password to connect to PgSQL server    |
| PGDATABASE | PgSQL server database name             |
| PGPORT     | Port number to connect to PgSQL server |
