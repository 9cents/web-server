# REGISTER
It takes parameters `name` and `password` and create a new entry in the database.
```
Content-Type: application/json

POST /register
{
  name: "name",
  password: "password"
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Entries must not be empty!       | Either name or password is empty.                  |
| Username already exists.     | The username already exists in the database (it must be unique)           |
| Player added.     | Player name and hashed password are successfully added   |

# LOGIN
It takes parameters `name` and `password` and create a new entry in the database.
```
Content-Type: application/json

GET /login
{
  name: "name",
  password: "password"
}
```
| Output   | Description                            |
| ---------- | -------------------------------------- |
| Entries must not be empty!       | Either name or password is empty                  |
| Player not found.    | The name does not exist in the database           |
| Passwords do not match     | The name exists in the database but password-given does not match   |
| Passwords match     | The name exists in the database and matches with the password-given   |