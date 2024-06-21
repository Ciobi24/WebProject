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
        if (userType === 'profesor' || userType === 'admin') {
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.onclick = openAddTemaModal;

            const container = document.querySelector('.container_princ');
            if (container) {
                container.insertBefore(addButton, container.firstChild );
            }           
            
            const buttons = document.querySelectorAll('.tema button, #myModal .modal-content button');
            if (buttons.length > 0) {
                buttons.forEach(button => {
                    button.classList.add('hidden');
                });
            }

        } else {
            const buttons = document.querySelectorAll('.tema button, #myModal .modal-content button');
            if (buttons.length > 0) {
                buttons.forEach(button => {
                    button.classList.add('hidden');
                });
            }
            const temaDivs = document.querySelectorAll('.tema');
            if (temaDivs.length > 0) {
                temaDivs.forEach(div => {
                    const solveButton = document.createElement('button');
                    solveButton.textContent = 'Rezolva';
                    solveButton.onclick = openProblemModal;

                    div.appendChild(solveButton);
                });
            }
        }
    }

    fetchUserDetails();
});

function openSolutionsPage() {
    window.location.href = "solutions.html";
}

function openProblemModal() {
    var modal = document.getElementById('problemModal');
    modal.style.display = "block";
}

function openUserSolution() {
    const userType = getUrlParam('userType');
    const url = 'solution.html';
    if (url.includes('?')) {
        window.location.href = `${url}&userType=${userType}`;
    } else {
        window.location.href = `${url}?userType=${userType}`;
    }
}

function openAddTemaModal() {
    var modal = document.getElementById('addTemaModal');
    modal.style.display = "block";
}

function closeAddTemaModal() {
    var modal = document.getElementById('addTemaModal');
    modal.style.display = "none";
}

function openProblemSolution(problemName, idTema, idProblema) {
    window.location.href = `/home/clasele-mele/teme/${idTema}/rezolva-pb/${idProblema}`;
}

function openTemePage() {
    const userType = getUrlParam('userType');
    const url = 'rezolva_pb.html';
    if (url.includes('?')) {
        window.location.href = `${url}&userType=${userType}`;
    } else {
        window.location.href = `${url}?userType=${userType}`;
    }
}
