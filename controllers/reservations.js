const { mysql } = require('../db/connection.js');

function index(req, res) {
  let query =
    `
    SELECT u.full_name user_name, u.email email, r.name room_name, res.*
    FROM reservations AS res
    LEFT JOIN users AS u
    ON u.id = res.user_id
    LEFT JOIN rooms AS r
    ON r.id = res.room_id
    `

  mysql.query(query, (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function indexFromUser(req, res) {
  const userid = req.params.userid;
  let query =
    `
    SELECT r.name room_name, t.name room_type, t.price price, res.*
    FROM reservations AS res
    LEFT JOIN rooms AS r
    ON r.id = res.room_id
    LEFT JOIN room_types AS t
    ON t.id = r.room_type
    WHERE res.user_id = ?
    `;

  mysql.query(query, [[userid]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function create(req, res) {
  const values = [];
  let query =
    `
    INSERT INTO reservations (room_id, user_id, phone, checkin, checkout)
    VALUES ?
    `;

  for (const room_id of req.body.room_id) {
    values.push([
      room_id,
      req.body.user_id,
      req.body.phone,
      req.body.checkin,
      req.body.checkout
    ])
  }

  mysql.query(query, [values], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function _delete(req, res) {
  const id = req.params.id;
  let query =
    `
    DELETE FROM reservations WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { index, indexFromUser, create, delete: _delete };
