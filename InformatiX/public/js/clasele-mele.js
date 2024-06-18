
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

    function addSections(userType, userId)
    {   
        function openAddUserModal() {
            var modal = document.getElementById('addUserModal');
            modal.style.display = "block";
        }
        
        // function closeAddUserModal() {
        //     var modal = document.getElementById('addUserModal');
        //     modal.style.display = "none";
        // }
        
        function addUser() {
            // Add user functionality
        }
        
        function openAddClassModal() {
            var modal = document.getElementById('addClassModal');
            modal.style.display = "block";
        }
        
        function closeAddClassModal() {
            var modal = document.getElementById('addClassModal');
            modal.style.display = "none";
        }
        
        function addClass() {
            var className = document.getElementById('newClassName').value;
            if (className) {
                console.log("New class added:", className);
                closeAddClassModal();
            } else {
                alert("Please enter a class name.");
            }
        }
    
        if (userType === 'profesor' || userType === 'admin') {

            const firstModalContent = document.querySelector('#myModal .modal-content');

            if (firstModalContent) {
                const addUserButton = document.createElement('button');
                addUserButton.textContent = 'Add User';
                addUserButton.onclick = openAddUserModal;
    
                firstModalContent.appendChild(addUserButton);
            }

            const container = document.querySelector('.container_princ');
            const addButton = document.createElement('button');
    
            addButton.textContent = '+';
            addButton.onclick = openAddClassModal;
    
            const secondElement = container.children[1];
            container.insertBefore(addButton, secondElement);
        }
    }

    fetchUserDetails();
});
