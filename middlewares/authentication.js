require('dotenv').config();
const jwt = require('jsonwebtoken');
const { mysql } = require('../db/connection.js');

function verify(req, res, next, roles) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send({ error: "Authorization header is not set" });
  }

  const authSplit = auth.split(' ');

  if (authSplit.length < 2) {
    return res.status(401).send({
      error: "Use bearer before token in authorization header"
    });
  }

  const token = authSplit[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.status(401).send({ error });
    if (roles && !roles.includes(user.role_name)) {
      return res.status(401).send({ error: 'Role is not authorized' });
    }

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

      next();
    });
  });
}

function admin(req, res, next) {
  verify(req, res, next, ['admin']);
}

function staff(req, res, next) {
  verify(req, res, next, ['admin', 'receptionist']);
}

module.exports = { admin, staff, verify };
