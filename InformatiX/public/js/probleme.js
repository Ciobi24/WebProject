document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userType = 'profesor'; // Example, this should be dynamic

    function addSection() {
        if (userType === 'profesor') {
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
                'Probleme elementare', 'Elemente ale limbajului', 'Tablouri unidimensionale/vectori',
                'Tablouri bidimensionale/matrici', 'Probleme diverse', 'Subprograme', 'Recursivitate',
                'Divide et Impera', 'Șiruri de caractere', 'Structuri de date liniare', 'Liste alocate dinamic',
                'Tipul struct', 'Teoria grafurilor', 'Programare dinamică', 'Metoda Greedy', 'Backtracking',
                'Arbori', 'Programare orientată pe obiecte'
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

    function submitProblem(event) {
        event.preventDefault();

        const nume_problema = document.getElementById('problemName').value;
        const dificultate = document.getElementById('problemDifficulty').value;
        const categorie = document.getElementById('problemCategory').value;
        const clasa = document.getElementById('classSelect').value;
        const text_problema = document.getElementById('problemText').value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/addProblema', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
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
            text_problema
        });

        xhr.send(data);
    }

    addSection();
});
