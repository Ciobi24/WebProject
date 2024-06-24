
document.addEventListener('DOMContentLoaded', function () {
    const problemsContainer = document.querySelector('.probleme');
    const userTable = document.querySelector('.user-table');

    function fetchProblems() {
        fetch('/api/getAllProblemsUnverified')
            .then(response => response.json())
            .then(data => {
                data.forEach(problem => {
                    const problemBox = buildProblemBox(problem);
                    problemsContainer.appendChild(problemBox);
                });
            })
            .catch(error => {
                console.error('Error fetching problems:', error);
            });
    }

    function buildProblemBox(problem) {
        const problemBox = document.createElement('div');
        problemBox.classList.add('problema');

        const title = document.createElement('h3');
        title.classList.add('titlu_prb');
        title.textContent = `Nume problema: ${problem.nume_problema}`;
        problemBox.appendChild(title);

        const description = document.createElement('p');
        description.classList.add('descriere_prb');
        description.textContent = problem.text_problema;
        problemBox.appendChild(description);

        const lastLine = document.createElement('div');
        lastLine.classList.add('last_line');

        const tags = document.createElement('div');
        tags.classList.add('tags');
        const tagElement = document.createElement('p');
        tagElement.classList.add('tag');
        tagElement.textContent = `Categorie: ${problem.categorie}`;
        tags.appendChild(tagElement);
        lastLine.appendChild(tags);

        const author = document.createElement('p');
        author.classList.add('autor');
        author.textContent = `Autor: ${problem.creatorId}`;
        lastLine.appendChild(author);

        const buttons = document.createElement('div');
        buttons.classList.add('butoane');

        const approveBtn = document.createElement('button');
        approveBtn.classList.add('aproba-btn');
        approveBtn.textContent = 'Aproba';
        approveBtn.addEventListener('click', () => approveProblem(problem.id));
        buttons.appendChild(approveBtn);

        const rejectBtn = document.createElement('button');
        rejectBtn.classList.add('respinge-btn');
        rejectBtn.textContent = 'Respinge';
        rejectBtn.addEventListener('click', () => rejectProblem(problem.id));
        buttons.appendChild(rejectBtn);

        lastLine.appendChild(buttons);

        problemBox.appendChild(lastLine);

        return problemBox;
    }

    function approveProblem(problemId) {
        fetch(`/api/checkSuccesProblem?id=${problemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .then(() => {
                location.reload();
            })
            .catch(error => {
                console.error('Error approving problem:', error);
            });
    }

    function rejectProblem(problemId) {
        fetch(`/api/checkFailProblem?id=${problemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: problemId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .then(() => {
                location.reload();
            })
            .catch(error => {
                console.error('Error rejecting problem:', error);
            });
    }


    function fetchUsers() {
        fetch('/api/getAllUsers')
            .then(response => response.json())
            .then(data => {
                const headers = ['ID', 'Username', 'Role', 'LastName', 'FirstName', 'Birthday', 'City', 'School'];
 
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headers.forEach(headerText => {
                    const headerCell = document.createElement('th');
                    headerCell.textContent = headerText;
                    headerCell.style.backgroundColor = "#c8bba5";
                    headerRow.appendChild(headerCell);
                });

                const deleteHeaderCell = document.createElement('th');
                deleteHeaderCell.textContent = 'Actions';
                deleteHeaderCell.style.backgroundColor = "#c8bba5";
                headerRow.appendChild(deleteHeaderCell);

                thead.appendChild(headerRow);
                userTable.appendChild(thead);

                data.forEach(user => {
                    const row = document.createElement('tr');

                    headers.forEach(headerText => {
                        const cell = document.createElement('td');
                        cell.textContent = user[headerText.toLowerCase()] || "nedefinit";
                        row.appendChild(cell);
                    });

                    if (user.role !== 'admin') {
                        const deleteCell = document.createElement('td');
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Șterge';
                        deleteButton.style.backgroundColor = '#ff6666';
                        deleteButton.style.color = 'white';
                        deleteButton.style.borderRadius = '5px';
                        deleteButton.style.border = 'none';
                        deleteButton.style.padding = '5px 5px';
                        deleteButton.style.cursor = 'pointer';
                        deleteButton.addEventListener('click', () => deleteUser(user.id));
                        deleteCell.appendChild(deleteButton);
                        row.appendChild(deleteCell);
                    } else {
                        const emptyCell = document.createElement('td');
                        row.appendChild(emptyCell);
                    }

                    userTable.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }



    function deleteUser(userId) {
        fetch(`/api/deleteUserAdmin?id=${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    }

    fetch('/getAllApplications')
    .then(response => response.json())
    .then(data => {
        const aplicariContainer = document.querySelector('.formular .mesaje');
        aplicariContainer.innerHTML = '';

        data.forEach(application => {
            const aplicare = document.createElement('div');
            aplicare.classList.add('aplicare');

            const idUser = application.user_id;

            const idUserParagraph = document.createElement('p');
            idUserParagraph.textContent = `ID Utilizator: ${idUser}`;

            const schoolNameParagraph = document.createElement('p');
            schoolNameParagraph.textContent = `Numele Școlii: ${application.school_name}`;

            const documentLink = document.createElement('a');
            documentLink.href = `/uploads/${idUser}`;
            documentLink.textContent = 'Vizualizează Document';
            documentLink.target = '_blank';

            const approveButton = document.createElement('button');
            approveButton.textContent = 'Aprobă';

            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'Respinge';

            const buttonStyle = `
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                margin-top: 10px;
                width: 100px;
                border-radius: 7px;
            `;

            approveButton.style.cssText = buttonStyle;
            rejectButton.style.cssText = buttonStyle;
            rejectButton.style.backgroundColor = '#f44336'; 

            approveButton.addEventListener('click', function(event) {
                event.preventDefault();
                handleAction(`/applyToTeacherAprobare/${idUser}`, 'Aprobat');
            });

            rejectButton.addEventListener('click', function(event) {
                event.preventDefault();
                handleAction(`/applyToTeacherRespingere/${idUser}`, 'Respins');
            });

            function handleAction(url, actionType) {
                fetch(url, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(`${actionType}:`, data);
                        alert(data.message);
                        location.reload();
                    })
                    .catch(error => {
                        console.error(`${actionType} Error:`, error);
                        alert(data.message);
                    });
            }

            aplicare.appendChild(idUserParagraph);
            aplicare.appendChild(schoolNameParagraph);
            aplicare.appendChild(documentLink);
            aplicare.appendChild(approveButton);
            aplicare.appendChild(rejectButton);

            aplicariContainer.appendChild(aplicare);
        });
    })
    .catch(error => {
        console.error('Eroare la preluarea datelor:', error);
    });






    fetchProblems();
    fetchUsers();
});
