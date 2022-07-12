require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { mysql } = require('./db/connection.js');
const { routes } = require('./routes/routes.js');
const app = express();

mysql.connect((err) => {
  if (err) throw err;
  console.log(
    '\x1b[32m%s\x1b[0m',
    `Connected to database ${process.env.DB_DATABASE}`
  );
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(process.env.PREFIX, routes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
});
