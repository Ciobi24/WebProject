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
        return await Problema.getById(id);
    }
    static async getProblemsUnverifiedService(role)
    {
        return await Problema.getUnverified();
    }
    static async getProblemsVerifiedService()
    {
        return await Problema.getVerified();
    }
}


module.exports = ProblemeService;
