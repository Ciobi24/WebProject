import { getCookie } from '../../src/services/CookieService.js';

document.addEventListener('DOMContentLoaded', function () {
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to parse JWT:', error);
            return null;
        }
    }
    function addSection() {
        const token = getCookie('jwt');
        console.log('Token:', token);
        if (token) {
            const decoded = parseJwt(token);
            const userType = decoded.role; 
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
                const categoryOptions = [
                    'Probleme elementare', 'Elemente ale limbajului', 'Tablouri unidimensionale',
                    'Tablouri bidimensionale', 'Probleme diverse', 'Subprograme', 'Recursivitate',
                    'Divide et Impera', 'Șiruri de caractere', 'Structuri de date liniare', 'Liste alocate dinamic',
                    'Tipul struct', 'Teoria grafurilor', 'Programare dinamica', 'Metoda Greedy', 'Backtracking',
                    'Arbori', 'Programare orientata pe obiecte'
                ];
                categoryOptions.forEach((optionText) => {
                    const option = document.createElement('option');
                    option.value = optionText.toLowerCase().replace(/ /g, '-');
                    option.textContent = optionText;
                    problemCategorySelect.appendChild(option);
                });

                const problemTextInput = document.createElement('textarea');
                problemTextInput.id = 'problemText';
                problemTextInput.placeholder = 'Textul problemei';

                const classSelectInput = document.createElement('select');
                classSelectInput.id = 'classSelect';
                const classOptions = ['Clasa a 9a', 'Clasa a 10a', 'Clasa a 11a'];
                classOptions.forEach((optionText, index) => {
                    const option = document.createElement('option');
                    option.value = `clasa${index + 9}`;
                    option.textContent = optionText;
                    classSelectInput.appendChild(option);
                });

                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.textContent = 'Submit';
                submitButton.addEventListener('click', submitProblem);

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
                    problemInputsContainer.appendChild(classSelectInput);
                    problemInputsContainer.appendChild(document.createElement('br'));
                    problemInputsContainer.appendChild(problemTextInput);
                    problemInputsContainer.appendChild(document.createElement('br'));
                    problemInputsContainer.appendChild(submitButton);
                }
            }
        }
    }

    function submitProblem(event) {
        event.preventDefault();

        const nume_problema = document.getElementById('problemName').value;
        const dificultate = document.getElementById('problemDifficulty').value;
        const categorie = document.getElementById('problemCategory').value;
        const clasa = document.getElementById('classSelect').value;
        const text_problema = document.getElementById('problemText').value;
        
        const token = getCookie('jwt');
        const decoded = parseJwt(token);
        const creatorId = decoded.id;

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
                    document.getElementById('classSelect').value = '';
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
            creatorId
        });

        xhr.send(data);
    }

    addSection();
});
