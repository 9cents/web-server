# REGISTER
It takes parameters `name` and `password` and create a new entry in the database.
```
Content-Type: application/json

POST /register
{
  "name": "player_name",
  "password": "password"
}

POST /registerweb
{
  "name": "instructor_name",
  "password": "password"
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Entries must not be empty!       | Either name or password is empty.                  |
| Username already exists.     | The username already exists in the database (it must be unique)           |
| Player/Instructor added.     | Player name and hashed password are successfully added   |

# LOGIN
It takes parameters `name` and `password` and create a new entry in the database.
```
Content-Type: application/json

GET /login
{
  "name": "player_name",
  "password": "password"
}

GET /loginweb
{
  "name": "instructor_name",
  "password": "password"
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Entries must not be empty!       | Either name or password is empty                  |
| Player/Instructor not found.    | The name does not exist in the database           |
| Passwords do not match     | The name exists in the database but password-given does not match   |
| Passwords match     | The name exists in the database and matches with the password-given   |

# ADD CHARACTER
It takes parameters `character` and modify an existing player in the database.
```
Content-Type: application/json

PUT /player
{
  "character": "Assassin"
  "conditions": {
    "player_id": 2
  }
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Row(s) updated.       | Character successfully assigned                  |

# ADD GROUP
It takes parameters `player_id` and modify an existing player in the database.
```
Content-Type: application/json

PUT /player
{
  "group_id": 1
  "conditions": {
    "player_id": 2
  }
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Row(s) updated.       | Group successfully assigned                  |

# HISTORY
It returns the latest 20 responses from the server.
```
Content-Type: application/json

GET /history
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Rows returned.       | History successfully returned                  |

# ACCURACY
It returns a player's accuracy (number of correct responses, incorrect responses, and percentage) throughout the game.
```
Content-Type: application/json

GET /accuracy?player_id=2

```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Rows returned.       | Accuracy successfully returned                  |

# UPDATE DUNGEON QUESTION FOR PLAYER
It takes parameters `player_id`, `id_1`, `id_2`, `id_3`, `id_4`, `id_5` and modify an existing player in the database.
```
Content-Type: application/json

PUT /updungeon
{
  "player_id": 2,
  "id_1": 1,
  "id_2": 2,
  "id_3": 3,
  "id_4": 4,
  "id_5": 5
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Dungeon updated.       | The dungeon is successfully modified                  |

# UPDATE DUNGEON QUESTION FOR INSTRUCTOR
It takes parameters `instructor_id`, `id_1`, `id_2`, `id_3`, `id_4`, `id_5` and modify an existing instructor in the database.
```
Content-Type: application/json

PUT /updungeonweb
{
  "instructor_id": 1,
  "id_1": 1,
  "id_2": 2,
  "id_3": 3,
  "id_4": 4,
  "id_5": 5
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Dungeon updated.       | The dungeon is successfully modified                  |

# UPDATE DUNGEON LOCK FOR INSTRUCTOR
It takes parameters `instructor_id` and turn on/off the lock in the database.
```
Content-Type: application/json

PUT /updungeonlockweb
{
  "instructor_id": 1
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Dungeon updated.       | The dungeon is successfully modified                  |