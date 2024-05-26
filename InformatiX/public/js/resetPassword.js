document.getElementById('reset-password-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    var newPassword = document.getElementById('Confirmpassword1').value;
    var confirmNewPassword = document.getElementById('Confirmpassword2').value;
    var errorMessage = document.getElementById('error-message');
  
    if (newPassword !== confirmNewPassword) {
      errorMessage.innerText = 'Parolele nu coincid!';
      errorMessage.style.display = 'block';
      setTimeout(function () {
        errorMessage.style.display = 'none';
      }, 7000); // timer de 7 secunde
      return;
    }
  
    var xhr = new XMLHttpRequest();
    console.log(newPassword);
    xhr.open('POST', '/getDateResetPassword', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {

            // afisare mesaj de succes
          errorMessage.style.display = 'none';
        } else {
          errorMessage.innerText = 'Eroare la resetarea parolei!';
          errorMessage.style.display = 'block';
          setTimeout(function () {
            errorMessage.style.display = 'none';
          }, 7000); // timer de 7 secunde
        }
      }
    };
    xhr.send(JSON.stringify({ newPassword: newPassword }));
  });
  