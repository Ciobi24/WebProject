const ProblemeService = require('../services/ProblemeService');
const { getJwt } = require("../services/JwtService");
const url = require('url');
const dbInstance = require('../models/db-config'); // Import the dbInstance

async function setProblemaRating(req, res) {
    console.log('setProblemaRating');
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            console.log('setProblemaRating');
            const formData = JSON.parse(body);
            const { rating } = formData;

            const urlParts = url.parse(req.url, true);
            const pathParts = urlParts.pathname.split('/');
            const idProblema = pathParts[pathParts.length - 2]; // Extract `idProblema` from URL

            // Assume `idUser` is obtained from JWT
            const cookieHeader = req.headers.cookie;
            const decoded = getJwt(cookieHeader);
            const idUser = decoded.id;
            console.log('setProblemaRating');
            ///aici crapa
            console.log(idProblema);
            console.log(idUser);
            dbInstance.connection.query(`
                SELECT * FROM rating WHERE id_problema = ? AND id_user = ?;
            `, [idProblema, idUser], (err, results) => {
                console.log('setProblemaRating');
                if (err) throw err;
                console.log(results);
                let oldRating = 0;

                if (results.length > 0) {
                    // If it exists, get the old rating
                    oldRating = results[0].rating;

                    // Update existing rating
                    dbInstance.connection.query(`
                        UPDATE rating SET rating = ? WHERE id_problema = ? AND id_user = ?;
                    `, [rating, idProblema, idUser], (err) => {
                        if (err) throw err;
                    });
                } else {
                    // Insert new rating
                    dbInstance.connection.query(`
                        INSERT INTO rating (id_problema, id_user, rating) VALUES (?, ?, ?);
                    `, [idProblema, idUser, rating], (err) => {
                        if (err) throw err;
                    });
                }

                // Get current rating info from `probleme` table
                dbInstance.connection.query(`
                    SELECT rating, nr_rating FROM probleme WHERE id = ?;
                `, [idProblema], (err, results) => {
                    if (err) throw err;

                    const currentRating = results[0].rating;
                    const currentNrRating = results[0].nr_rating;

                    // Calculate new rating average
                    let newRating;
                    if (results.length > 0) {
                        // If updating existing rating
                        newRating = ((currentRating * currentNrRating) - oldRating + rating) / currentNrRating;
                    } else {
                        // If adding a new rating
                        newRating = ((currentRating * currentNrRating) + rating) / (currentNrRating + 1);
                    }

                    // Update `probleme` table with new rating and number of ratings
                    dbInstance.connection.query(`
                        UPDATE probleme SET rating = ?, nr_rating = ? WHERE id = ?;
                    `, [newRating, results.length > 0 ? currentNrRating : currentNrRating + 1, idProblema], (err) => {
                        if (err) throw err;

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Rating-ul a fost actualizat cu succes.' }));
                    });
                });
            });
        } catch (error) {
            console.error('Error setting problem rating:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Eroare la actualizarea rating-ului.' }));
        }
    });
}




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
async function getProblemaById(req, res) {
    const urlParts = url.parse(req.url, true);
    const pathParts = urlParts.pathname.split('/');
    const idProblema = pathParts[pathParts.length - 1];

    try {
        const problema = await ProblemeService.getProblemaById(idProblema);
        if (problema) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(problema));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Problema not found');
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

module.exports = { setProblemaRating,
    getProblemaById,addProblemaHandler, getProblemeByCategorie, getProblemeByClasa, getProblemaStats
};
