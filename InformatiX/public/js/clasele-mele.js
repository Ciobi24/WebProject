document.addEventListener('DOMContentLoaded', function () {
    function fetchUserDetails() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/user', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const user = JSON.parse(xhr.responseText);
                    addSections(user.role, user.id); // Pass user role and id
                } else {
                    console.error('Failed to fetch user details:', xhr.responseText);
                }
            }
        };
        xhr.send();
    }

    function addSections(userType, userId) {
        function openAddUserModal() {
            var modal = document.getElementById('addUserModal');
            modal.style.display = "block";
        }
        
        function openAddClassModal() {
            var modal = document.getElementById('addClassModal');
            modal.style.display = "block";
        }
        
        function closeAddClassModal() {
            var modal = document.getElementById('addClassModal');
            modal.style.display = "none";
        }

        function openDeleteUserModal() {
            var modal = document.getElementById('deleteUserModal');
            modal.style.display = "block";
        }

        function closeDeleteUserModal() {
            var modal = document.getElementById('deleteUserModal');
            modal.style.display = "none";
        }

        if (userType === 'profesor' || userType === 'admin') {
            const firstModalContent = document.querySelector('#myModal .modal-content');

            if (firstModalContent) {
                const addUserButton = document.createElement('button');
                addUserButton.textContent = 'Add User';
                addUserButton.onclick = openAddUserModal;

                const deleteUserButton = document.createElement('button');
                deleteUserButton.textContent = 'Delete User';
                deleteUserButton.onclick = openDeleteUserModal;

                firstModalContent.appendChild(addUserButton);
                firstModalContent.appendChild(deleteUserButton);
            }
            const container = document.querySelector('.container_princ');
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.onclick = openAddClassModal;

            const secondElement = container.children[1];
            container.insertBefore(addButton, secondElement);
        } else {
            // Remove the "Șterge clasa" button if the user is not a professor or admin
            const deleteClassButton = document.querySelector('#myModal .modal-content button[onclick="confirmDeleteClass()"]');
            if (deleteClassButton) {
                deleteClassButton.remove();
            }
        }
    }

    fetchUserDetails();

    var addClassButton = document.getElementById('buttonCreareClasa');
    addClassButton.addEventListener('click', function () {
        var className = document.getElementById('newClassName').value.trim();

        if (className) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/createClass', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    alert('Clasă adăugată cu succes!');
                    document.getElementById('newClassName').value = "";
                    closeAddClassModal();
                    window.location.href='/home/clasele-mele';
                } else if (xhr.status === 409) { 
                    alert('Eroare! Numele clasei este deja utilizat.');
                } else {
                    alert('Eroare! Serverul a returnat statusul ' + xhr.status);
                }
            };

            xhr.onerror = function () {
                alert('Eroare! Cererea a eșuat.');
            };

            var formData = JSON.stringify({ className: className });
            xhr.send(formData);
        } else {
            alert('Eroare! Numele clasei nu poate fi gol.');
        }
    });
});
