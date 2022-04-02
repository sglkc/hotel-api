const { mysql } = require('../db/connection.js');

function index(req, res) {
  let query =
    `
    SELECT * FROM room_types
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
    SELECT * FROM room_types WHERE id = ?
    `;

  mysql.query(query, [[id]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function create(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, price:int, total:int'
    });
  }

  const values = [
    req.body.name,
    req.body.price,
    req.body.total
  ];
  let query =
    `
    INSERT INTO room_types (name, price, total) VALUES ?
    `;

  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function update(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, price:int, total:int'
    });
  }

  const id = req.params.id;
  let query =
    `
      SELECT * FROM room_types WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const type = result[0];
    const values = [
      (req.body.name ?? type.name),
      (req.body.price ?? type.price),
      (req.body.total ?? type.total),
      id
    ];
    query =
      `
      UPDATE room_types SET name = ?, price = ?, total = ?
      WHERE id = ?
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
    DELETE FROM room_types WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { index, get, create, update, delete: _delete };
