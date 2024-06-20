const { getJwt } = require("../services/JwtService");
const { createTemaService, getTemeByIdClass } = require("../services/TemeService");

async function createTema(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);

        const cookieHeader = req.headers.cookie;
        const decoded = getJwt(cookieHeader);

        const { nume, deadline, classId} = formData;

        if (decoded.role !== 'admin' && decoded.role !== 'profesor') {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission!' }));
            return;
        }

        try {
            const result = await createTemaService(nume, deadline , classId, decoded.id);

            if (result === 1) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Tema creată cu succes!' }));
            } else if (result === 2) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User does not have permission!' }));
            } else if (result === 3) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Nume pentru temă deja utilizat!' }));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error deleting class.' }));
        }
    });
}

async function getTeme(req, res) {
    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const idClass = queryObject.get('id');

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const role = decoded.role;

    if (role !== 'admin' && role !== 'profesor') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
        return;
    }

    try {
        const results = await getTemeByIdClass(idClass, decoded.id);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
    }
}
module.exports = { createTema, getTeme }