const Problema = require('../models/Problema');

class ProblemeService {
    static async insertProblema(nume_problema, dificultate, categorie, clasa, text_problema, creatorId) {
        return await Problema.create(nume_problema, dificultate, categorie, clasa, text_problema, creatorId);
    }
}

module.exports = ProblemeService;
