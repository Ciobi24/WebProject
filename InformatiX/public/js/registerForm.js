document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm'); // id-ul formularului
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // previne comportamentul implicit de trimitere a formularului

        // Preia valorile din câmpurile de intrare
        const username = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Creează un obiect cu datele
        const data = {
            username: username,
            email: email,
            password: password
        };

        // Trimite datele către server folosind XMLHttpRequest sau fetch API
        // Voi folosi aici metoda fetch pentru a trimite datele
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Verifică dacă răspunsul este ok
            if (response.ok) {
                return response.json(); // returnează răspunsul sub formă de JSON
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Server response:', data); // afișează răspunsul de la server în consolă
            // Aici poți face alte acțiuni în funcție de răspunsul primit de la server
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
});
