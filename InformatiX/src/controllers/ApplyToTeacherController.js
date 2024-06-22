const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getJwt } = require("../services/JwtService");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function applyToTeacherController(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const formData = JSON.parse(body);
            const file = formData.file;
            const school1 = formData.body.school;
            const cookieHeader = req.headers.cookie;
            console.log(school1);
            const decoded = getJwt(cookieHeader);
            if (!decoded || (decoded.role !== 'elev')) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission!' }));
                return;
            }

            if (!file) {
                console.error('Fișierul nu a fost încărcat');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Fișierul nu a fost încărcat' }));
                return;
            }

            const insertResult = await insertTeacherApplication(userId, school1, file.path);
            if (insertResult) {
                upload.single('image')(req, res, async function (err) {
                    if (err) {
                        console.error('Eroare în timpul încărcării fișierului:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Eroare în timpul încărcării fișierului' }));
                        return;
                    }
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Formularul a fost trimis cu succes!' }));
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Formularul nu a fost trimis!' }));
            }
        } catch (error) {
            console.error('Eroare în timpul procesării cererii:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Eroare în timpul procesării cererii' }));
        }
    });
}


module.exports = { applyToTeacherController };
