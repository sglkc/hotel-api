const { mysql } = require('../db/connection.js');

function getRooms(req, res) {
  let query =
    `
    SELECT jk.name AS nama_jenis_kamar, jk.harga_kamar, k.* FROM kamar AS k
    LEFT JOIN jenis_kamar AS jk
    ON jk.id = k.jenis_kamar
    `
  mysql.query(query, (err, result) => {
    if (err) {
      return res.status(400).send({
        error: err
      })
    }

    return res.status(200).send({
      result: result
    });
  });
}

module.exports = { getRooms };
