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
| Row(s) updated.       | Character successfully assigned                  |

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
