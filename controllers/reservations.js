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
      error: 'room_id:int, user_id:int, phone:string, notes:string'
    });
  }

  const values = [
    req.body.room_id,
    req.body.user_id,
    req.body.phone,
    req.body.notes
  ];
  let query =
    `
    INSERT INTO reservations (room_id, user_id, phone, notes) VALUES ?
    `;

  mysql.query(query, [[values]], (error, reult) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function update(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'phone:string, notes:string'
    });
  }

  const id = req.params.id;
  let query =
    `
    SELECT * FROM reservations WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const reservation = result[0];
    const values = [
      (req.body.phone ?? room.phone),
      (req.body.notes ?? room.notes),
      id
    ];
    query =
      `
      UPDATE reservations SET phone = ?, notes = ? WHERE id = ?
      `;

    mysql.query(query, values, (error, result) => {
      if (error) return res.status(400).send({ error });
      return res.status(200).send({ result });
    });
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

module.exports = { index, create, update, delete: _delete };
