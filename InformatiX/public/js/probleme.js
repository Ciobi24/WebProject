import categories from './categories.js';

document.addEventListener('DOMContentLoaded', function () {
    function fetchUserDetails() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/user', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const user = JSON.parse(xhr.responseText);
                    addSection(user.role, user.id); // Pass user role and id
                } else {
                    console.error('Failed to fetch user details:', xhr.responseText);
                }
            }
        };
        xhr.send();
    }

    function addSection(userType, userId) {
        console.log('User type:', userType);
        if (userType === 'profesor' || userType === 'admin') {
            const addProblemTitle = document.createElement('h3');
            addProblemTitle.textContent = 'Adaugă o problemă';

            const problemNameInput = document.createElement('input');
            problemNameInput.type = 'text';
            problemNameInput.id = 'problemName';
            problemNameInput.placeholder = 'Numele problemei';

            const problemDifficultySelect = document.createElement('select');
            problemDifficultySelect.id = 'problemDifficulty';
            const difficultyOptions = ['Ușoară', 'Medie', 'Grea'];
            difficultyOptions.forEach((optionText) => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase();
                option.textContent = optionText;
                problemDifficultySelect.appendChild(option);
            });

            const problemCategorySelect = document.createElement('select');
            problemCategorySelect.id = 'problemCategory';
            Object.keys(categories).forEach((clasa) => {
                categories[clasa].forEach((optionText) => {
                    const option = document.createElement('option');
                    option.value = optionText.toLowerCase().replace(/ /g, '-');
                    option.textContent = optionText;
                    problemCategorySelect.appendChild(option);
                });
            });

            const problemTextInput = document.createElement('textarea');
            problemTextInput.id = 'problemText';
            problemTextInput.placeholder = 'Textul problemei';

            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            submitButton.addEventListener('click', function(event) {
                submitProblem(event, userId); // Pass userId to submitProblem
            });

            const problemInputsContainer = document.getElementById('problemInputs');
            if (problemInputsContainer) {
                problemInputsContainer.innerHTML = '';

                problemInputsContainer.appendChild(addProblemTitle);
                problemInputsContainer.appendChild(problemNameInput);
                problemInputsContainer.appendChild(document.createElement('br'));
                problemInputsContainer.appendChild(problemDifficultySelect);
                problemInputsContainer.appendChild(document.createElement('br'));
                problemInputsContainer.appendChild(problemCategorySelect);
                problemInputsContainer.appendChild(document.createElement('br'));
                problemInputsContainer.appendChild(problemTextInput);
                problemInputsContainer.appendChild(document.createElement('br'));
                problemInputsContainer.appendChild(submitButton);
            }
        }
    }

    function getClassByCategory(category) {
        for (const clasa in categories) {
            if (categories[clasa].map(cat => cat.toLowerCase().replace(/ /g, '-')).includes(category)) {
                return clasa;
            }
        }
        return null;
    }

    function submitProblem(event, userId) {
        event.preventDefault();

        const nume_problema = document.getElementById('problemName').value;
        const dificultate = document.getElementById('problemDifficulty').value;
        const categorie = document.getElementById('problemCategory').value;
        const clasa = getClassByCategory(categorie); // Get class based on category
        const text_problema = document.getElementById('problemText').value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/addProblema', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    document.getElementById('problemName').value = '';
                    document.getElementById('problemDifficulty').value = '';
                    document.getElementById('problemCategory').value = '';
                    document.getElementById('problemText').value = '';
                    alert(response.message);
                } else {
                    alert('Error: ' + response.message);
                }
            }
        };

        const data = JSON.stringify({
            nume_problema,
            dificultate,
            categorie,
            clasa,
            text_problema,
            userId // Include creatorId in the payload
        });

        xhr.send(data);
    }

    fetchUserDetails(); // Fetch user details and call addSection with the user role
});
