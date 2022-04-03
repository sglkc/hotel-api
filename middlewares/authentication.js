require('dotenv').config();
const jwt = require('jsonwebtoken');
const { mysql } = require('../db/connection.js');

function adminOnly(req, res, next) {
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
    if (user.role_name !== 'admin') {
      return res.status(401).send({ error: 'Role is not authorized' });
    }

    const query =
      `
        SELECT r.name AS role_name, u.* FROM users AS u
        LEFT JOIN roles AS r
        ON r.id = u.role
        WHERE u.id = ? AND role_name = ?
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

module.exports = { adminOnly }
