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
 async function getProblemeByCategorie(req, res) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const categorie = urlParams.get('categorie');

    try {
        const probleme = await ProblemeService.getProblemeByCategorie(categorie);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(probleme));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A apărut o eroare.', error: error.message }));
    }
}

 async function getProblemeByClasa(req, res) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const clasa = urlParams.get('clasa');

    try {
        const probleme = await ProblemeService.getProblemeByClasa(clasa);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(probleme));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A apărut o eroare.', error: error.message }));
    }
}
async function getProblemaStats(req, res) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('id');

    try {
        const problema = await Problema.findById(id);
        if (problema) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                utilizatori_incercat: problema.utilizatori_incercat,
                utilizatori_rezolvat: problema.utilizatori_rezolvat
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Problema not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
}

module.exports = {
    addProblemaHandler, getProblemeByCategorie, getProblemeByClasa, getProblemaStats
};
