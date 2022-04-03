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
      error: 'full_name:string, email:string, password:string, role:int'
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
        mysql.query(
          'INSERT INTO users (full_name, email, password, role) VALUES (?)',
          [ [ req.body.full_name, req.body.email, hash, req.body.role ] ],
          (error, result) => {
            if (error) return res.status(400).send({ error });
            return res.status(200).send({ result });
          }
        );
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

  const query =
    `
      SELECT r.name AS role_name, u.* FROM users AS u
      LEFT JOIN roles AS r
      ON r.id = u.role
      WHERE email = ?
    `;

  mysql.query(
    query,
    [ req.body.email ],
    (error, result) => {
      if (error) return res.status(400).send({ error });
      if (!result.length) {
        return res.status(400).send({ error: 'Email do not match our record' });
      }

      const user = result[0];
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error) return res.status(400).send({ error });
        if (!result) return res.status(400).send({ error: 'Password invalid'});

        const token = jwt.sign(
          { id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' }
        );

        delete user.password;

        return res.status(200).send({ result: { token, user } });
      });
    }
  )
}

function verify(req, res) {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) return res.status(401).send({ error });
    return res.status(200).send({ result: decoded });
  });
}

function getRoles(req, res) {
  mysql.query('SELECT * FROM roles', (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Roles empty' });

    return res.status(200).send({ result });
  });
}

module.exports = { getRoles, login, register, verify };
