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
                    alert('Contul a fost creat cu succes! Continuați prin a vă loga cu datele dvs, apoi în cont la secțiunea Profil completați-vă profilul!');
                } else {
                    alert('Eroare la crearea contului: ' + xhr.responseText);
                }
            }
        };

        xhr.send(JSON.stringify({ username: username, email: email, password: password }));
    });

    document.getElementById('login').addEventListener('submit', function (event) {
        event.preventDefault();

        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/home', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var token = response.token;
                    var redirectUrl = response.redirectUrl;
                    document.cookie = 'jwt=' + token + ';path=/'; 
                    
                    window.location.href = redirectUrl;
                }
                else {
                    alert('Eroare la autentificare! Email și/sau parolă incorecte.');
                }
            }
        };

        xhr.send(JSON.stringify({ email: email, password: password }));

    });

    document.getElementById('resetPasswordForm').addEventListener('submit', function (event) {
        event.preventDefault();
        var email = document.getElementById('emailForgotPassword').value;
        var xhr = new XMLHttpRequest();
    
        xhr.open('POST', '/reset-password', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    alert('A password reset link has been sent to your email.');
                    document.getElementById('emailForgotPassword').value = ''; // clear the input field
                } else {
                    alert('Failed to send reset link. Please try again.');
                }
            }
        };
    
        xhr.send(JSON.stringify({ email: email }));
    });
    
    window.addEventListener('scroll', function() {
        var modal = document.getElementById('myModal');
        var modalRect = modal.getBoundingClientRect(); 
        var windowHeight = window.innerHeight || document.documentElement.clientHeight; 
      
        if (modalRect.top >= 0 && modalRect.bottom <= windowHeight) {
          closeModal(); 
        }
      });
});
