const Problema = require('../models/Problema');

class ProblemeService {
    static async insertProblema(nume_problema, dificultate, categorie, clasa, text_problema, creatorId) {
        return await Problema.create(nume_problema, dificultate, categorie, clasa, text_problema, creatorId);
    }
    static async getProblemeByCategorie(categorie) {
        return await Problema.getAllByCategorie(categorie);
    }

    static async getProblemeByClasa(clasa) {
        return await Problema.getAllByClasa(clasa);
    }
    static async getProblemaById(id){
        console.log(id);
        return await Problema.getById(id);
    }
}

module.exports = ProblemeService;
