# hotel-api

This was made for my school competency test, it's discontinued so don't even bother to make issues or pull requests. You're free to use this anywhere.

## Getting Started

1.  Clone the repo

```sh
git clone https://github.com/sglkc/hotel-api.git
cd hotel-api
```

2.  Install npm dependencies

```sh
npm install
```

3.  Copy or rename `.env.example` to `.env`
4.  Insert your database credentials, server port, and JWT secret key in `.env`
5.  Run the migration script (Make sure you already made the database!)

```sh
npm run migrate
```

-   You might want to seed the tables

```sh
npm run migrate seed
```

6.  Run the start/dev script

```sh
npm run dev
npm run start
```

-   dev script uses [nodemon](https://nodemon.io/) to run, this will make your server restarts when a file changes, perfect for development.
-   start script runs the api with node.

## Migrations

This project uses a handmade database migration system made out of a JSON file `migrations/migrations.json`. You can run this with the migrate script or from `migrations/migrate.js`.

The following are the available arguments:

```sh
npm run migrate help - help for commands
npm run migrate fresh - drop every table
npm run migrate seed - seed tables
```

## Endpoints

### Auth

| Endpoint       | Method | Request                            | Response (result)                                                   |
| -------------- | ------ | ---------------------------------- | ------------------------------------------------------------------- |
| /auth/roles    | GET    |                                    | `[ { id, name }, ... ]`                                             |
| /auth/register | POST   | `full_name, email, password, role` | `{ MYSQL_RESULTS }` or `error`                                      |
| /auth/login    | POST   | `email, password`                  | `{ token, user: { role_name, id, full_name, email, phone, role } }` |

### Services

#### Facilities

| Endpoint                 | Method | Header       | Request              | Response (result)                     |
| ------------------------ | ------ | ------------ | -------------------- | ------------------------------------- |
| /services/facilities     | GET    |              |                      | `[ { id, name, notes, image }, ... ]` |
| /services/facilities     | POST   | Bearer token | `name, image, notes` | `{ MYSQL_RESULTS }`                   |
| /services/facilities/:id | PUT    | Bearer token | `name, image, notes` | `{ MYSQL_RESULTS }`                   |
| /services/facilities/:id | DELETE | Bearer token |                      | `{ MYSQL_RESULTS }`                   |

#### Rooms

| Endpoint            | Method | Header       | Request                     | Response (result)                                                          |
| ------------------- | ------ | ------------ | --------------------------- | -------------------------------------------------------------------------- |
| /services/rooms     | GET    |              |                             | `[ { type_name, price, id, name, room_type, capacity, created_at }, ... ]` |
| /services/rooms/:id | GET    |              |                             | `[ { type_name, price, id, name, room_type, capacity, created_at } ]`      |
| /services/rooms     | POST   | Bearer token | `name, room_type, capacity` | `{ MYSQL_RESULTS }`                                                        |
| /services/rooms/:id | PUT    | Bearer token | `name, capacity, status`    | `{ MYSQL_RESULTS }`                                                        |
| /services/rooms/:id | DELETE | Bearer token |                             | `{ MYSQL_RESULTS }`                                                        |

#### Room Types

| Endpoint                            | Method | Header       | Request                                  | Response (result)                                         |
| ----------------------------------- | ------ | ------------ | ---------------------------------------- | --------------------------------------------------------- |
| /services/room-types                | GET    |              |                                          | `[ { id, name, description, image, price, total }, ... ]` |
| /services/room-types/:id            | GET    |              |                                          | `[ { id, name, description, image, price, total } ]`      |
| /services/room-types/:id/facilities | GET    |              |                                          | `[ { id, room_type, name, notes }, ... ]`                 |
| /services/room-types                | POST   | Bearer token | `name, description, image, price, total` | `{ MYSQL_RESULTS }`                                       |
| /services/room-types/:id            | PUT    | Bearer token | `name, price, total`                     | `{ MYSQL_RESULTS }`                                       |
| /services/room-types/:id            | DELETE | Bearer token |                                          | `{ MYSQL_RESULTS }`                                       |

#### Room Facilities

| Endpoint                      | Method | Header       | Request                  | Response (result)                                    |
| ----------------------------- | ------ | ------------ | ------------------------ | ---------------------------------------------------- |
| /services/room-facilities     | GET    |              |                          | `[ { type_name, id, room_type, name, notes }, ... ]` |
| /services/room-facilities     | POST   | Bearer token | `room_type, name, notes` | `{ MYSQL_RESULTS }`                                  |
| /services/room-facilities/:id | PUT    | Bearer token | `name, notes`            | `{ MYSQL_RESULTS }`                                  |
| /services/room-facilities/:id | DELETE | Bearer token |                          | `{ MYSQL_RESULTS }`                                  |

#### Reservation

| Endpoint                   | Method | Header       | Request | Response (result)                                                                                      |
| -------------------------- | ------ | ------------ | ------- | ------------------------------------------------------------------------------------------------------ |
| /services/reservations     | GET    | Bearer token |         | `[ { user_name, email, phone, room_name, id, room_id, user_id, checkin, checkout, created_at }, ... ]` |
| /services/reservations/:id | DELETE | Bearer token |         | `{ MYSQL_RESULTS }`                                                                                    |

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
