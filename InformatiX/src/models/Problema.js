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
}

module.exports = Problema;
