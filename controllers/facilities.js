const { mysql } = require('../db/connection.js');

function index(req, res) {
  let query =
    `
    SELECT * FROM facilities
    `;

  mysql.query(query, (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function create(req, res) {
  const values = [
    req.body.name,
    req.body.notes,
    req.body.image
  ];
  let query =
    `
    INSERT INTO facilities (name, notes, image) VALUES ?
    `;

  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function update(req, res) {
  const id = req.params.id;
  let query =
    `
      SELECT * FROM facilities WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const facility = result[0];
    const values = [
      (req.body.name ?? facility.name),
      (req.body.notes ?? facility.notes),
      (req.body.image ?? facility.image),
      id
    ];
    query =
      `
      UPDATE facilities SET name = ?, notes = ?, image = ? WHERE id = ?
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
    DELETE FROM facilities WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { index, create, update, delete: _delete };
