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
  cryptPassword(req.body.password, (error, hash) => {
    if (error) return res.status(400).send({ error });

    mysql.query(
      'SELECT * FROM users WHERE email IN (?) OR phone IN (?)',
      [ req.body.email, req.body.phone ],
      (error, result) => {
        if (error) return res.status(400).send({ error });
        if (result.length) {
          return res.status(400).send({
            error: 'Email or phone has been registered'
          });
        }

        const values = [
          req.body.full_name,
          req.body.email,
          req.body.phone,
          hash,
          req.body.role
        ];
        let query =
          `
          INSERT INTO users (full_name, email, phone, password, role)
          VALUES (?)
          `;

        mysql.query(query, [values], (error, result) => {
          if (error) return res.status(400).send({ error });
          return res.status(200).send({ result });
        }
        );
      }
    );
  });
}

function login(req, res) {
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
          { id: user.id, role_name: user.role_name },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );

        delete user.password;

        return res.status(200).send({ result: { token, user } });
      });
    }
  )
}

function verify(req, res) {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.status(401).send({ error });

    const query =
      `
        SELECT r.name AS role_name, u.* FROM users AS u
        LEFT JOIN roles AS r
        ON r.id = u.role
        WHERE u.id = ? AND r.name = ?
      `;

    mysql.query(query, [user.id, user.role_name], (error, result) => {
      if (error) return res.status(401).send({ error });
      if (!result.length) {
        return res.status(401).send({ error: 'User not found' });
      }

      return res.status(200).send({ result: user });
    });
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
