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

function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error:
        'room_id:int, user_id:int, phone:string, checkin:date, checkout:date'
    });
  }

  const values = [
    req.body.room_id,
    req.body.user_id,
    req.body.phone,
    req.body.checkin,
    req.body.checkout
  ];
  let query =
    `
    INSERT INTO reservations (room_id, user_id, phone, checkin, checkout)
    VALUES ?
    `;

  mysql.query(query, [[values]], (error, result) => {
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

module.exports = { index, create, delete: _delete };
