const { getJwt } = require("../services/JwtService");
const { getClassesForProf, getClassesForElev, insertClass, addUserToClass,
    checkDuplicateClassName, getUsersByClassId, deleteClassById, deleteUserFromClass } = require("../services/ClassesService");

async function getClassesByUser(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    try {
        const role = decoded.role;
        const userId = decoded.id;

        let body = [];
        if (role === 'elev') {
            body = await getClassesForElev(userId);
        } else {
            body = await getClassesForProf(userId);
        }
        if (!Array.isArray(body)) {
            body = Object.values(body);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(body));
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: error.message }));
    }
}

async function createClass(req, res) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const role = decoded.role;
            if (role !== 'admin' && role !== 'profesor') {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
                return;
            }
            const formData = JSON.parse(body);
            if (!formData.className) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request', error: 'Class name is required' }));
                return;
            }
            if (await checkDuplicateClassName(decoded.id, formData.className)) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Nume pentru clasă deja folosit!' }));
                return;
            }
            const insertSuccess = await insertClass(formData.className, decoded.id);

            if (insertSuccess) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Class added successfully' }));
                return;
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error', error: 'Failed to insert class' }));
                return;
            }

        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
        }
    });
}
async function getUsersByIdClass(req, res) {
    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const idClass = queryObject.get('id');

    if (!idClass) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad Request', error: 'Class ID is required' }));
        return;
    }

    try {
        const users = await getUsersByClassId(idClass);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
    }
}

async function addUserToClassController(req, res) {
    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const idClass = queryObject.get('id');

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const role = decoded.role;
        if (role !== 'admin' && role !== 'profesor') {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
            return;
        }

        const formData = JSON.parse(body);
        try {
            const result = await addUserToClass(formData.idFormular, idClass);

            if (result.success) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message }));
            } else {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message }));
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error!' });
        }
    });
}

async function deleteClassByIdController(req, res) {
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
        const result = await deleteClassById(idClass, decoded.id);

        if (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Class deleted successfully.' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'User does not have permission or class not found!' }));
        }
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error deleting class.' }));
    }
}

async function deleteUserFromClassController(req, res) {
    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const idClass = queryObject.get('id');

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const role = decoded.role;

    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        if (role !== 'admin' && role !== 'profesor') {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
            return;
        }

        const formData = JSON.parse(body);
        try {
            const result = await deleteUserFromClass(idClass, formData.idFormular , decoded.id);

            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'User deleted successfully.' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User does not have permission or user to delete not found!' }));
            }
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error deleting class.' }));
        }
    });
}

module.exports = {
    getClassesByUser, createClass, getUsersByIdClass, addUserToClassController,
    deleteClassByIdController, deleteUserFromClassController, deleteUserFromClassController
}