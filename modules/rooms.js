const { mysql } = require('../db/connection.js');

function getRooms(req, res) {
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

function createRoom(req, res) {
  const values = [
    req.body.name,
    req.body.room_type,
    req.body.max_capacity
  ];
  let query =
    `
    INSERT INTO rooms (name, room_type, max_capacity) VALUES ?
    `;

  mysql.beginTransaction();
  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });

    const inventories = req.body.inventory.map((inv) => {
      return [ result.insertId, inv ];
    });
    query = `INSERT INTO inventories (room_id, name) VALUES ?`;

    mysql.query(query, [inventories], (error, result) => {
      if (error) return res.status(400).send({ error });
      mysql.commit();
      return res.status(200).send({ result });
    });
  });
}

function updateRoom(req, res) {
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
      (req.body.max_capacity ?? room.max_capacity),
      (req.body.status ?? room.status),
      id
    ];
    query =
      `
      UPDATE rooms SET name = ?, max_capacity = ?, status = ? WHERE id = ?
      `;

    mysql.query(query, values, (error, result) => {
      if (error) return res.status(400).send({ error });
      return res.status(200).send({ result });
    });
  });
}

function deleteRoom(req, res) {
  const id = req.params.id;
  let query =
    `
    DELETE FROM inventories WHERE room_id = ?;
    DELETE FROM rooms WHERE id = ?
    `;

  mysql.query(query, [id, id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
