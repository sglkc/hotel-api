const { mysql } = require('../db/connection.js');

function getRooms(req, res) {
  let query =
    `
    SELECT jk.name AS nama_jenis_kamar, jk.harga_kamar, k.* FROM kamar AS k
    LEFT JOIN jenis_kamar AS jk
    ON jk.id = k.jenis_kamar
    `;

  mysql.query(query, (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

function createRoom(req, res) {
  const values = [
    req.body.name,
    req.body.jenis_kamar,
    req.body.max_kapasitas
  ];
  let query =
    `
    INSERT INTO kamar (name, jenis_kamar, max_kapasitas) VALUES ?
    `;

  mysql.beginTransaction();
  mysql.query(query, [[values]], (error, result) => {
    if (error) return res.status(400).send({ error });

    const inventories = req.body.inventory.map((inv) => {
      return [ result.insertId, inv ];
    });
    query = `INSERT INTO inventory_kamar (kamar_id, nama) VALUES ?`;

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
      SELECT * FROM kamar WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    if (!result.length) return res.status(400).send({ error: 'Not found' });

    const room = result[0];
    const values = [
      (req.body.name ?? room.name),
      (req.body.max_kapasitas ?? room.max_kapasitas),
      (req.body.status ?? room.status),
      id
    ];
    query =
      `
      UPDATE kamar SET name = ?, max_kapasitas = ?, status = ? WHERE id = ?
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
    DELETE FROM kamar WHERE id = ?
    `;

  mysql.query(query, [id], (error, result) => {
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ result });
  });
}

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
