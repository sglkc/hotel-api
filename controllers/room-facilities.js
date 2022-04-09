const { mysql } = require('../db/connection.js');

function index(req, res) {
  let query =
    `
    SELECT t.name AS type_name, f.* FROM room_facilities AS f
    LEFT JOIN room_types AS t
    ON t.id = f.room_type
    `;

  mysql.query(query, (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function indexFromType(req, res) {
  const typeid = req.params.typeid;
  let query =
    `
    SELECT * FROM room_facilities WHERE room_type = ?
    `;

  mysql.query(query, [[typeid]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'room_type:int, name:string, notes:string|null'
    });
  }

  const values = [
    req.body.room_type,
    req.body.name,
    req.body.notes
  ];
  let query =
    `
    INSERT INTO room_facilities (room_type, name, notes) VALUES ?
    `;

  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function update(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, notes:string|null'
    });
  }

  const id = req.params.id;
  let query =
    `
    SELECT * FROM room_facilities WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const room = result[0];
    const values = [
      (req.body.name ?? room.name),
      (req.body.notes ?? room.notes),
      id
    ];
    query =
      `
      UPDATE room_facilities SET name = ?, notes = ? WHERE id = ?
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
    DELETE FROM room_facilities WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { index, indexFromType, create, update, delete: _delete };
