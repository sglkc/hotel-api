require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mysql } = require('../db/connection.js');

function cryptPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);
    bcrypt.hash(password, salt, (err, hash) => {
      return callback(err, hash);
    });
  });
}

function register(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'fullname:string, email:string, password:string, role:int'
    });
  }

  cryptPassword(req.body.password, (error, hash) => {
    if (error) return res.status(400).send({ error });

    mysql.query(
      'SELECT * FROM users WHERE EMAIL IN (?)',
      [ req.body.email ],
      (error, result) => {
        if (error) return res.status(400).send({ error });
        if (result.length) {
          return res.status(400).send({ error: 'Email has been registered' });
        }
      }
    );

    mysql.query(
      'INSERT INTO users (fullname, email, password, role) VALUES (?)',
      [ [ req.body.fullname, req.body.email, hash, req.body.role ] ],
      (error, result) => {
        if (error) return res.status(400).send({ error });
        return res.status(200).send({ result });
      }
    );
  });
}

function login(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'email:string, password:string'
    });
  }

  mysql.query(
    'SELECT * FROM users WHERE email = ?',
    [ req.body.email ],
    (error, result) => {
      if (error) return res.status(400).send({ error });
      if (!result.length) {
        return res.status(400).send({ error: 'Email do not match our record' });
      }

      const user = result[0];
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error) return res.status(400).send({ error });
        if (!res) return res.status(400).send({ error: 'Password is invalid'});

        const token = jwt.sign(
          { id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' }
        );

        return res.status(200).send({ result: { token, user } });
      });
    }
  )
}

function getRoles(req, res) {
  mysql.query('SELECT * FROM roles', (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Roles empty' });

    return res.status(200).send({ result });
  });
}

module.exports = { getRoles, login, register };
