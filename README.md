# Ruff REPL

This is a simple REPL for iPad/iPhone. Currently, Python 3 is the only supported language, but this will change in the future. If you have a request for a language or any questions, email me:

This app was built primarily to accompany my workflow which uses an iPad with an Apple Magic Keyboard, so there are some shortcuts in the REPL:

  - Clear console: Option + 'K' (˚ character)
  - Previous command: Option + ';' (… character)
  - Next command: Option + '.' (≥ character)
  
This app is open source! There is currently not an android version, so if you fork to release on android, all I ask for is credit.

Feel free to contact me if you have any questions/requests.

## Instructions for cloning
After cloning the repo, a few files are needed to get things started:

### `env.ts`
Create and `env.ts` file in `ipad-repl-app/` with contents:
```ts
export const API_URL:string = <API_URL>;
```
and replace <API_URL> with the location of the server running the `backend` app (usually localhost:8000) in dev.
### Django env file
Create a `.env` file in `backend/` and fill in the contents:
```
SECRET_KEY="<CREATE_A_SECRET_KEY>"
ALLOWED_HOSTS=localhost 
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=postgres
SQL_USER=postgres
SQL_PASSWORD=postgres
SQL_HOST=db
SQL_PORT=5432
```
---
**NOTE** that these settings are for the dev environment and are different in the current production build

---

### Production
The production build also relies on `backend/.db_env` so to deploy, create this file and fill with postgresql credentials:
```
POSTGRES_DB=<DB_NAME>
POSTGRES_USER=<DB_USER>
POSTGRES_PASSWORD=<DB_PASSWORD>
```