const ProblemeService = require('../services/ProblemeService');
const { getJwt } = require("../services/JwtService");
const url = require('url');
const dbInstance = require('../models/db-config'); // Import the dbInstance
const { respingereProblemaService, aprobareProblemaService } = require('../services/AdministratoriService');

async function deleteComment(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const formData = JSON.parse(body);
            const { idProblema, idTema } = formData;
            const cookieHeader = req.headers.cookie;
            const decoded = getJwt(cookieHeader);
            const idUser = decoded.id;

            const connection = await dbInstance.connect();

            await connection.execute(`
            UPDATE solutii SET comentariu = NULL
            WHERE id_problema = ? AND id_tema = ? AND id_user = ?
        `, [idProblema, idTema, idUser]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Comment deleted successfully.' }));

        } catch (error) {
            console.error('Error deleting comment:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Error deleting comment.' }));
        }
    });
}

async function getSolutionByUserAndProblem(req, res) {
    const urlParts = url.parse(req.url, true);
    const idProblema = parseInt(urlParts.query.idProblema, 10);
    const idTema = parseInt(urlParts.query.idTema, 10);

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const idUser = parseInt(decoded.id, 10);

    try {
        const connection = await dbInstance.connect();
        const [existingSolution] = await connection.execute(`
            SELECT text_solutie FROM solutii WHERE id_problema = ? AND id_user = ? AND id_tema = ?;
        `, [idProblema, idUser, idTema]);

        if (existingSolution.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, solution: existingSolution[0].text_solutie }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, solution: '' }));
        }
    } catch (error) {
        console.error('Error fetching solution:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error fetching solution.' }));
    }
}

async function fetchCommentsHandler(req, res) {
    const queryObject = url.parse(req.url, true).query;
    const idProblema = parseInt(queryObject.idProblema, 10);
    const idTema = parseInt(queryObject.idTema, 10);

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const idUser = parseInt(decoded.id, 10);

    try {
        const connection = await dbInstance.connect();
        const [comments] = await connection.query(`
            SELECT s.comentariu AS text, u.firstname, u.lastname, s.id_user
            FROM solutii s
            JOIN users u ON s.id_user = u.id
            WHERE s.id_tema = ? AND s.id_problema = ?
        `, [idTema, idProblema]);

        const [teacherComment] = await connection.query(`
            SELECT s.comentariu_prof AS text
            FROM solutii s
            WHERE s.id_tema = ? AND s.id_problema = ? AND s.id_user = ?
        `, [idTema, idProblema, idUser]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            comments: comments.length ? comments : [],
            teacherComment: teacherComment.length ? teacherComment[0].text : null,
            currentUserId: idUser
        }));
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error fetching comments.' }));
    }
}
async function submitSolution(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const formData = JSON.parse(body);
            const { idProblema, idTema, textSolutie } = formData;

            const cookieHeader = req.headers.cookie;
            const decoded = getJwt(cookieHeader);
            const idUser = parseInt(decoded.id, 10);

            const connection = await dbInstance.connect();

            // Check if solution exists
            const [existingSolution] = await connection.execute(`
                SELECT * FROM solutii WHERE id_problema = ? AND id_user = ? AND id_tema = ?
            `, [idProblema, idUser, idTema]);

            if (existingSolution.length > 0) {
                // Update the existing solution
                await connection.execute(`
                    UPDATE solutii SET text_solutie = ? WHERE id_problema = ? AND id_user = ? AND id_tema = ?
                `, [textSolutie, idProblema, idUser, idTema]);
            } else {
                // Insert a new solution
                await connection.execute(`
                    INSERT INTO solutii (id_problema, id_user, id_tema, text_solutie) VALUES (?, ?, ?, ?)
                `, [idProblema, idUser, idTema, textSolutie]);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Solution submitted successfully!' }));
        } catch (error) {
            console.error('Error submitting solution:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Error submitting solution.' }));
        }
    });
}

async function getDeadlineByTema(req, res) {
    const urlParts = url.parse(req.url, true);
    const pathParts = urlParts.pathname.split('/');
    const idTema = parseInt(pathParts[3], 10);

    try {
        const connection = await dbInstance.connect();
        const query = 'SELECT deadline FROM teme WHERE id = ?';
        const [results] = await connection.query(query, [idTema]);

        if (results.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deadline: results[0].deadline }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Tema not found' }));
        }
    } catch (error) {
        console.error('Error fetching deadline:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
}

async function setProblemaRating(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const formData = JSON.parse(body);
            const { Rating } = formData;
            const rating = parseInt(Rating, 10);
            const urlParts = url.parse(req.url, true);
            const pathParts = urlParts.pathname.split('/');
            const idProblema = parseInt(pathParts[pathParts.length - 2], 10);
            const cookieHeader = req.headers.cookie;
            const decoded = getJwt(cookieHeader);
            const idUser = parseInt(decoded.id, 10);

            console.log(`Rating: ${rating}, idProblema: ${idProblema}, idUser: ${idUser}`);

            const connection = await dbInstance.connect();

            // Check if a rating already exists
            const [existingRating] = await connection.query(`
                SELECT * FROM rating WHERE id_problema = ? AND id_user = ?;
            `, [idProblema, idUser]);
            console.log('HEI');
            let oldRating = 0;

            if (existingRating.length > 0) {
                oldRating = existingRating[0].rating;
                // Update existing rating
                await connection.query(`
                    UPDATE rating SET rating = ? WHERE id_problema = ? AND id_user = ?;
                `, [rating, idProblema, idUser]);
            } else {
                // Insert new rating
                await connection.query(`
                    INSERT INTO rating (id_problema, id_user, rating) VALUES (?, ?, ?);
                `, [idProblema, idUser, rating]);
            }

            // Get current rating info from `probleme` table
            const [problemaInfo] = await connection.query(`
                SELECT rating, nr_rating FROM probleme WHERE id = ?;
            `, [idProblema]);

            const currentRating = problemaInfo[0].rating;
            const currentNrRating = problemaInfo[0].nr_rating;

            // Calculate new rating average
            let newRating;
            if (existingRating.length > 0) {
                newRating = ((currentRating * currentNrRating) - oldRating + rating) / currentNrRating;
            } else {
                newRating = ((currentRating * currentNrRating) + rating) / (currentNrRating + 1);
            }
            console.log('newRating', newRating);
            // Update `probleme` table with new rating and number of ratings
            await connection.query(`
                UPDATE probleme SET rating = ?, nr_rating = ? WHERE id = ?;
            `, [newRating, existingRating.length > 0 ? currentNrRating : currentNrRating + 1, idProblema]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Rating-ul a fost actualizat cu succes.' }));
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

async function getProblemsUnverified(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const role = decoded.role;
    if (role !== 'admin' && role !== 'profesor') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
        return;
    }
    try {
        const probleme = await ProblemeService.getProblemsUnverifiedService();

        if (probleme) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(probleme));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found!');
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function aprobareProblema(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const role = decoded.role;

    if (role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
        return;
    }

    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const idProblema = queryObject.get('id');

    try {
        const result = await aprobareProblemaService(idProblema);

        if (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Problema aprobată cu succes!' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Problema nu a putut fi aprobată. Fie nu există, fie a fost deja aprobată!' }));
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Eroare internă a serverului.' }));
    }
}

async function respingereProblema(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const role = decoded.role;

    if (role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
        return;
    }

    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const idProblema = queryObject.get('id');

    try {
        const result = await respingereProblemaService(idProblema);

        if (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Problema respinsă cu succes!' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Problema nu a putut fi respinsă! Fie nu există, fie nu a putut fi ștearsă.' }));
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Eroare internă a serverului.' }));
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
async function handleCommentSubmission(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const formData = JSON.parse(body);
            const { idProblema, idTema, comentariu } = formData;
            const cookieHeader = req.headers.cookie;
            const decoded = getJwt(cookieHeader);
            const idUser = decoded.id;

            const connection = await dbInstance.connect();

            // Verifică dacă există deja un comentariu pentru această problemă, temă și utilizator
            const [existingComment] = await connection.query(`
                SELECT * FROM solutii WHERE id_problema = ? AND id_tema = ? AND id_user = ?
            `, [idProblema, idTema, idUser]);

            if (existingComment.length > 0) {
                // Dacă există, actualizează comentariul existent
                await connection.query(`
                    UPDATE solutii SET comentariu = ? WHERE id_problema = ? AND id_tema = ? AND id_user = ?
                `, [comentariu, idProblema, idTema, idUser]);
            } else {
                // Dacă nu există, inserează un nou comentariu
                await connection.query(`
                    INSERT INTO solutii (id_problema, id_tema, id_user, comentariu) VALUES (?, ?, ?, ?)
                `, [idProblema, idTema, idUser, comentariu]);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Comentariul a fost adăugat/actualizat cu succes.' }));
        } catch (error) {
            console.error('Error handling comment submission:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Eroare la adăugarea/actualizarea comentariului.' }));
        }
    });
}

module.exports = {
    deleteComment, setProblemaRating, getDeadlineByTema, submitSolution, getSolutionByUserAndProblem,
    getProblemaById, addProblemaHandler, getProblemeByCategorie, getProblemeByClasa, getProblemaStats, getProblemsUnverified,
    aprobareProblema, respingereProblema, fetchCommentsHandler, handleCommentSubmission
};
