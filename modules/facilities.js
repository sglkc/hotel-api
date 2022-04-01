const { mysql } = require('../db/connection.js');

function getFacilities(req, res) {
  let query =
    `
    SELECT * FROM facilities
    `;

  mysql.query(query, (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function createFacility(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, notes:string|null'
    });
  }

  const values = [
    req.body.name,
    req.body.notes
  ];
  let query =
    `
    INSERT INTO facilities (name, notes) VALUES ?
    `;

  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function updateFacility(req, res) {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      error: 'name:string, notes:string|null'
    });
  }

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
      id
    ];
    query =
      `
      UPDATE facilities SET name = ?, notes = ? WHERE id = ?
      `;

    mysql.query(query, values, (error, result) => {
      if (error) return res.status(400).send({ error });
      return res.status(200).send({ result });
    });
  });
}

function deleteFacility(req, res) {
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

module.exports = {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility
};
