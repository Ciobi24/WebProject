

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('signup').addEventListener('submit', function (event) {
        event.preventDefault();

        var username = document.getElementById('username').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Contul a fost creat cu succes!');
                    var successMessage = document.getElementById('success-message-register');
                    successMessage.innerText = 'Contul a fost creat cu succes! Continuați prin a vă loga cu datele dvs, apoi în cont la secțiunea Profil completați-vă profilul!';
                    successMessage.style.display = 'block';
                    var errorMessage = document.getElementById('error-message-register');
                    errorMessage.style.display = 'none';
                    setTimeout(function () {
                        successMessage.style.display = 'none';
                    }, 10000);
                } else {
                    var errorMessage = document.getElementById('error-message-register');
                    errorMessage.innerText = 'Eroare la crearea contului: ' + xhr.responseText;
                    errorMessage.style.display = 'block';

                    var successMessage = document.getElementById('success-message-register');
                    successMessage.style.display = 'none';
                    setTimeout(function () {
                        errorMessage.style.display = 'none';
                    }, 20000);
                }
            }
        };

        xhr.send(JSON.stringify({ username: username, email: email, password: password }));
    });

    document.getElementById('login').addEventListener('submit', function (event) {
        event.preventDefault();

        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
        console.log(email);
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/user', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    window.location.href = '/user';
                    document.getElementById('error-message').style.display = 'none';
                }
                else {
                    var errorMessage = document.getElementById('error-message');
                    errorMessage.innerText = 'Eroare la autentificare! Email și/sau parolă incorecte.';
                    errorMessage.style.display = 'block';

                    setTimeout(function () {
                        errorMessage.style.display = 'none';
                    }, 7000); //timer de 7 secunde 
                }
            }
        };

        xhr.send(JSON.stringify({ email: email, password: password }));

    });

});
