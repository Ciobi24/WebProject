const jwt = require('jsonwebtoken');
const { findUserByEmailAndPassword, getUserById } = require('../services/UserService');
const bcrypt = require('bcrypt');

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);
        const email = formData.email;
        const password = formData.password;

        try {
            if (!secretKey) {
                throw new Error('Secret key is missing or not set');
            }

            const user = await findUserByEmailAndPassword(email, password);
            if (user) {
                const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '24h' });
                
                let redirectUrl = '/home'; 
                if (user.role === 'admin') {
                    redirectUrl = '/home/administrare';
                }

                res.writeHead(200, {
                    'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict`,
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({ success: true, redirectUrl }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Email sau parolă incorecte' }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    });
}
async function handleLogout(req, res) {
    try {
        // Clear the token cookie
        res.writeHead(200, {
            'Set-Cookie': `token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ success: true, message: 'Logout successful' }));
    } catch (error) {
        console.error('Logout error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Logout failed' }));
    }
}
async function logout() {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        alert('Logout successful');
        window.location.href = '/';
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
module.exports = {
    handleLogin,handleLogout,logout
};
