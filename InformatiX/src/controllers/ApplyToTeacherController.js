const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getJwt } = require("../services/JwtService");
const { insertTeacherApplication, getApplications, aprobareApplicationService, respingereApplicationService } = require("../services/SwitchToTeacherService");
const { getUserById } = require('../services/UserService');

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

    const user = await getUserById(decoded.id);

    if (!decoded || (user.role !== 'elev')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User does not have permission!', error: 'User does not have permission!' }));
        return;
    } 
    
    if (user.role === 'profesor' || user.role === 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Aveți deja rol de profesor!', error: 'Aveți deja rol de profesor!' }));
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

async function respingereApplicationController(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);

    if (!decoded || decoded.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission!' }));
        return;
    }
    const urlParts = req.url.split('/');
    const idUser = urlParts[urlParts.length - 1];

    if (!idUser || isNaN(idUser)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'Bad request!' }));
        return;
    }

    try {
        const result = await respingereApplicationService(idUser);

        if (result) {
            await deleteFilesById(idUser);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Cerere respinsa cu succes!' }));
        } else {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Nu s-a putut respinge! Cerere inexistentă!' }));
        }
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Eroare la adăugarea problemei.' }));
    }
}

async function aprobareApplicationController(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);

    if (!decoded || decoded.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission!' }));
        return;
    }
    const urlParts = req.url.split('/');
    const idUser = urlParts[urlParts.length - 1];

    if (!idUser || isNaN(idUser)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'Bad request!' }));
        return;
    }

    try {
        const result = await aprobareApplicationService(idUser);
        if (result) {
            await deleteFilesById(idUser);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Cerere aprobată cu succes!' }));
        } else {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Nu s-a putut aproba! Cerere inexistentă!' }));
        }
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Eroare la adăugarea problemei.' }));
    }
}

async function deleteFilesById(idUser) {
    const directoryPath = path.join(__dirname, '../../public/uploads');

    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Unable to scan directory:', err);
                reject(err);
                return;
            }

            const userFiles = files.filter(file => file.startsWith(idUser));

            if (userFiles.length === 0) {
                console.warn('No files found for user:', idUser);
                resolve(false);
                return;
            }

            let deletePromises = userFiles.map(file => {
                return new Promise((res, rej) => {
                    fs.unlink(path.join(directoryPath, file), err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                            rej(err);
                        } else {
                            console.log('File deleted successfully:', file);
                            res(true);
                        }
                    });
                });
            });

            Promise.all(deletePromises)
                .then(() => resolve(true))
                .catch(err => reject(err));
        });
    });
}

module.exports = { applyToTeacherController, getAllApplicationsController, respingereApplicationController, aprobareApplicationController };
