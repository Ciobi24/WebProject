document.addEventListener('DOMContentLoaded', function () {

    function sendRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/user', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        var response = JSON.parse(xhr.responseText);
                        console.log('Received response from /api/user:', response);
                        document.getElementById('lastname').value = response.lastname || '';
                        document.getElementById('firstname').value = response.firstname || '';
                        document.getElementById('email').value = response.email || '';
                        if (response.birthday) {

                            var birthdayDate = new Date(response.birthday);
                            var formattedBirthday = birthdayDate.toISOString().slice(0, 10);
                            document.getElementById('birthday').value = formattedBirthday;
                        } else {
                            document.getElementById('birthday').value = '';
                        }
                        document.getElementById('city').value = response.city || '';
                        document.getElementById('school').value = response.school || '';
                    } catch (e) {
                        console.error("Could not parse response as JSON: " + e.message);
                    }
                } else {
                    console.error('Error: ' + xhr.statusText);
                }
            }
        };

        xhr.send();
    }

    function updateUser(event) {
        event.preventDefault();

        var currentData = {
            lastname: document.getElementById('lastname').value,
            firstname: document.getElementById('firstname').value,
            email: document.getElementById('email').value,
            birthday: document.getElementById('birthday').value,
            city: document.getElementById('city').value,
            school: document.getElementById('school').value
        };

        var xhr = new XMLHttpRequest();
        xhr.open('PATCH', '/api/updateUser', true);
        xhr.setRequestHeader('Content-Type', 'application/json-patch+json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("User updated successfully");

                    var successMessage = document.getElementById('successMessage');
                    successMessage.style.display = 'block';

                    setTimeout(function () {
                        successMessage.style.display = 'none';
                    }, 10000);
                } else {
                    console.error('Error: ' + xhr.statusText);
                }
            }
        };

        xhr.send(JSON.stringify(currentData));
    }

    document.getElementById('submit1').addEventListener('click', updateUser);

    sendRequest();

});
