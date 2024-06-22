const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getJwt } = require("../services/JwtService");
const { insertTeacherApplication, getApplications } = require("../services/SwitchToTeacherService");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, cb) {
        const cookieHeader = req.headers.cookie;
        const decoded = getJwt(cookieHeader);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, decoded.id + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function applyToTeacherController(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);

    if (!decoded || (decoded.role !== 'elev')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission!' }));
        return;
    }

    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error('Eroare în timpul încărcării fișierului:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Eroare în timpul încărcării fișierului' }));
            return;
        }

        try {

            const school1 = req.body.school;
            const file = req.file;
            if (!file || !school1) {
                console.error('Fișierul nu a fost încărcat');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Fișierul nu a fost încărcat' }));
                return;
            }

            const insertResult = await insertTeacherApplication(decoded.id, school1, file.path);
            if (insertResult == 1) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Formularul a fost trimis cu succes!' }));
            } else if (insertResult == -1) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'O cerere a fost deja trimisa' }));
            }
            else {
                fs.unlink(file.path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Eroare la ștergerea fișierului:', unlinkErr);
                    }
                });

                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: insertResult.message }));
            }
        } catch (error) {
            console.error('Eroare în timpul procesării cererii:', error);

            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Eroare la ștergerea fișierului:', unlinkErr);
                    }
                });
            }

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Eroare în timpul procesării cererii' }));
        }
    });
}


async function getAllApplicationsController(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const role = decoded.role;

    if (role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
        return;
    }

    try {
        const results = await getApplications();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error.' }));
    }
}


module.exports = { applyToTeacherController, getAllApplicationsController };
