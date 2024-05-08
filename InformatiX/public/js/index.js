

document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('signup').addEventListener('submit', function(event) {
      event.preventDefault(); 
    
      var username = document.getElementById('username').value;
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
    
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/register', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  console.log('Contul a fost creat cu succes!');
                  // cod pt html 
              } else {
                  // cod pt html
                  console.error('A apărut o eroare în timpul creării contului:', xhr.responseText);
              }
          }
      };
      
      xhr.send(JSON.stringify({ username: username, email: email, password: password }));
  });
});
