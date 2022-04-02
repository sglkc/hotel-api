const { mysql } = require('../db/connection.js');

function index(req, res) {
  let query =
    `
    SELECT t.name AS type_name, t.price, r.* FROM rooms AS r
    LEFT JOIN room_types AS t
    ON t.id = r.room_type
    `;

  mysql.query(query, (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function get(req, res) {
  const id = req.params.id;
  let query =
    `
    SELECT t.name AS type_name, t.price, r.* FROM rooms AS r
    LEFT JOIN room_types AS t
    ON t.id = r.room_type
    WHERE r.id = ?
    `;

  mysql.query(query, [[id]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, room_type:int, capacity:int'
    });
  }

  const values = [
    req.body.name,
    req.body.room_type,
    req.body.capacity
  ];
  let query =
    `
    INSERT INTO rooms (name, room_type, capacity) VALUES ?
    `;

  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function update(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, capacity:int, status:int'
    });
  }

  const id = req.params.id;
  let query =
    `
      SELECT * FROM rooms WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const room = result[0];
    const values = [
      (req.body.name ?? room.name),
      (req.body.capacity ?? room.capacity),
      (req.body.status ?? room.status),
      id
    ];
    query =
      `
      UPDATE rooms SET name = ?, capacity = ?, status = ? WHERE id = ?
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
    DELETE FROM rooms WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { index, get, create, update, delete: _delete };
