document.getElementById('reset-password-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    var newPassword = document.getElementById('Confirmpassword1').value;
    var confirmNewPassword = document.getElementById('Confirmpassword2').value;
    var errorMessage = document.getElementById('error-message');

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const resetToken = url.searchParams.get('token');
  
    if (newPassword !== confirmNewPassword) {
      errorMessage.innerText = 'Parolele nu coincid!';
      errorMessage.style.display = 'block';
      setTimeout(function () {
        errorMessage.style.display = 'none';
      }, 7000); // timer de  7 secunde
      return;
    }
  
    var xhr = new XMLHttpRequest();
    console.log(newPassword);
    xhr.open('POST', '/getDateResetPassword', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          errorMessage.style.display = 'none';
          document.getElementById("reset-password-form").style.display = "none";
          document.getElementById("reset-message").style.display = "block";
          document.getElementById("button").style.display = "block";
        } else {
          errorMessage.innerText = 'Eroare la resetarea parolei!';
          errorMessage.style.display = 'block';
          setTimeout(function () {
            errorMessage.style.display = 'none';
          }, 7000); // timer de 7 secunde
        }
      }
    };
    xhr.send(JSON.stringify({ newPassword: newPassword,  resetToken: resetToken }));
  });
  