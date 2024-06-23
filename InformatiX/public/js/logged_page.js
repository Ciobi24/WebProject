document.addEventListener('DOMContentLoaded', function () {

    function sendRequest() {
        fetch('/api/user')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("helloUser").innerHTML = `Bine ai venit ${data.username}!`;
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    sendRequest();
});
