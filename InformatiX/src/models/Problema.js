const dbInstance = require('../models/db-config');

class Problema {
    constructor(id, nume_problema, dificultate, categorie, clasa, text_problema, creatorId) {
        this.id = id;
        this.nume_problema = nume_problema;
        this.dificultate = dificultate;
        this.categorie = categorie;
        this.clasa = clasa;
        this.text_problema = text_problema;
        this.creatorId = creatorId;
    }

    static async create(nume_problema, dificultate, categorie, clasa, text_problema, creatorId) {
        const connection = await dbInstance.connect();
        const query = `
            INSERT INTO probleme (nume_problema, dificultate, categorie, clasa, text_problema, verified, rating, utilizatori_incercat, utilizatori_rezolvat, creator_id)
            VALUES (?, ?, ?, ?, ?, FALSE, 0, 0, 0, ?)
        `;
        const [results] = await connection.query(query, [nume_problema, dificultate, categorie, clasa, text_problema, creatorId]);
        return new Problema(results.insertId, nume_problema, dificultate, categorie, clasa, text_problema, creatorId);
    }
    static async getAllByCategorie(categorie) {
        const connection = await dbInstance.connect();
        const query = 'SELECT * FROM probleme WHERE categorie LIKE ?';
        const [results] = await connection.query(query, [categorie]);
        return results.map(row => new Problema(
            row.id, row.nume_problema, row.dificultate, row.categorie, row.clasa, row.text_problema, row.creator_id, row.verified, row.rating, row.utilizatori_incercat, row.utilizatori_rezolvat
        ));
    }

    static async getAllByClasa(clasa) {
        const connection = await dbInstance.connect();
        const query = 'SELECT * FROM probleme WHERE clasa LIKE ?';
        const [results] = await connection.query(query, [clasa]);
        return results.map(row => new Problema(
            row.id, row.nume_problema, row.dificultate, row.categorie, row.clasa, row.text_problema, row.creator_id, row.verified, row.rating, row.utilizatori_incercat, row.utilizatori_rezolvat
        ));
    }
}

module.exports = Problema;
