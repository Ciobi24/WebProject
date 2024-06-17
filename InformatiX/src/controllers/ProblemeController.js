const ProblemeService = require('../services/ProblemeService');
const { getJwt } = require("../services/JwtService");

async function addProblemaHandler(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);

        const cookieHeader = req.headers.cookie;
        const decoded = getJwt(cookieHeader);
        const creatorId = decoded.id;

        const { nume_problema, dificultate, categorie, clasa, text_problema } = formData;

        try {
            await ProblemeService.insertProblema(nume_problema, dificultate, categorie, clasa, text_problema, creatorId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Problema a fost adăugată cu succes și este în așteptare pentru aprobare.' }));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Eroare la adăugarea problemei.' }));
        }
    });
}

module.exports = {
    addProblemaHandler,
};
