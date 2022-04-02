const { mysql } = require('../db/connection.js');

function index(req, res) {
  const roomid = req.params.roomid;
  let query =
    `
    SELECT * FROM room_facilities WHERE room_id = ?
    `;

  mysql.query(query, [[roomid]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, notes:string|null'
    });
  }

  const values = [
    req.params.roomid,
    req.body.name,
    req.body.notes
  ];
  let query =
    `
    INSERT INTO room_facilities (room_id, name, notes) VALUES ?
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

  const roomid = req.params.roomid;
  const id = req.params.id;
  let query =
    `
    SELECT * FROM room_facilities WHERE room_id = ? AND id = ?
    `;

  mysql.query(query, [roomid, id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const room = result[0];
    const values = [
      (req.body.name ?? room.name),
      (req.body.notes ?? room.notes),
      roomid,
      id
    ];
    query =
      `
      UPDATE room_facilities SET name = ?, notes = ?
      WHERE room_id = ? AND id = ?
      `;

    mysql.query(query, values, (error, result) => {
      if (error) return res.status(400).send({ error });
      return res.status(200).send({ result });
    });
  });
}

function _delete(req, res) {
  const roomid = req.params.roomid;
  const id = req.params.id;
  let query =
    `
    DELETE FROM room_facilities WHERE room_id = ? AND id = ?
    `;

  mysql.query(query, [roomid, id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { index, create, update, delete: _delete };
