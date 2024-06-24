document.addEventListener('DOMContentLoaded', function () {
    const urlParams = window.location.pathname.split('/');
    const idTema = urlParams[4];
    const idUser = urlParams[6];

    async function fetchProblemsByTema(idTema) {
        try {
            const response = await fetch(`/api/problems?temaId=${idTema}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const problems = await response.json();
            displayProblems(problems);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    }

    async function fetchUserById(userId) {
        try {
            const response = await fetch(`/api/user?id=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const user = await response.json();
            return user.firstname + ' ' + user.lastname; 
        } catch (error) {
            console.error('Error fetching user data:', error);
            return 'Unknown Author';
        }
    }

    async function fetchSolutionByUser(idProblema, idTema, idUser) {
        try {
            const response = await fetch(`/api/getSolution/evaluare/?idProblema=${idProblema}&idTema=${idTema}&idUser=${idUser}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            return result.success ? result.solution : '';
        } catch (error) {
            console.error('Error fetching solution:', error);
            return '';
        }
    }

    async function displayProblems(problems) {
        const problemsContainer = document.getElementById('problems-container');
        problemsContainer.innerHTML = '';

        for (const problema of problems) {
            const problemElement = document.createElement('div');
            problemElement.classList.add('problema');

            const authorName = await fetchUserById(problema.creator_id);
            problemElement.innerHTML = `
                <h1>#${problema.id} ${problema.nume_problema}</h1>
                <button class="share-button">share</button>
                <div class="ratings">
                    <span class="stars">${problema.rating}★</span>
                    <span class="users-tried">${problema.utilizatori_incercat} încercări</span>
                    <span class="users-solved">${problema.utilizatori_rezolvat} rezolvări</span>
                </div>
                <p class="cerinta">${problema.text_problema}</p>
                <div class="tags">
                    <p>${problema.clasa}</p>
                    <p>${problema.dificultate}</p>
                    <p>${problema.categorie}</p>
                </div>
                <p class="autor">Autor: ${authorName}</p>
            `;

            problemsContainer.appendChild(problemElement);

            const shareButton = problemElement.querySelector('.share-button');
            if (shareButton) {
                shareButton.addEventListener('click', function () {
                    const problemaData = {
                        nume_problema: problema.nume_problema,
                        rating: problema.rating,
                        utilizatori_incercat: problema.utilizatori_incercat,
                        utilizatori_rezolvat: problema.utilizatori_rezolvat,
                        text_problema: problema.text_problema,
                        clasa: problema.clasa,
                        dificultate: problema.dificultate,
                        categorie: problema.categorie,
                        autor: authorName,
                    };
                    downloadJSON(problemaData, `${problema.nume_problema}.json`);
                });
            }

            // Fetch and display solution outside the problem container
            const solution = await fetchSolutionByUser(problema.id, idTema, idUser);
            const solutionElement = document.createElement('div');
            solutionElement.classList.add('code-section');
            solutionElement.innerHTML = `
                <h3>Solution for ${problema.nume_problema}</h3>
                <pre><code>${solution}</code></pre>
                <div class="professor-comment">
                    <label for="professor-comment-input-${problema.id}">Comentariul Profesorului:</label>
                    <textarea id="professor-comment-input-${problema.id}" rows="4" cols="50"></textarea>
                    <button id="submit-professor-comment-${problema.id}">Trimite Comentariul</button>
                </div>
                <div class="professor-grade">
                    <label for="professor-grade-input-${problema.id}">Nota:</label>
                    <input type="number" id="professor-grade-input-${problema.id}" min="1" max="10">
                    <button id="submit-professor-grade-${problema.id}">Trimite Nota</button>
                </div>
            `;

            problemsContainer.appendChild(solutionElement);

            const submitCommentButton = document.getElementById(`submit-professor-comment-${problema.id}`);
            if (submitCommentButton) {
                submitCommentButton.addEventListener('click', async function () {
                    const comment = document.getElementById(`professor-comment-input-${problema.id}`).value;
                    await submitProfessorComment(problema.id, idTema, idUser, comment);
                });
            }

            const submitGradeButton = document.getElementById(`submit-professor-grade-${problema.id}`);
            if (submitGradeButton) {
                submitGradeButton.addEventListener('click', async function () {
                    const grade = document.getElementById(`professor-grade-input-${problema.id}`).value;
                    await submitProfessorGrade(problema.id, idTema, idUser, grade);
                });
            }
        }
    }

    async function displayEvaluatedStudentName(idUser) {
        const studentName = await fetchUserById(idUser);
        document.getElementById('evaluated-student-name').innerText = `Evaluating: ${studentName}`;
    }

    async function submitProfessorComment(idProblema, idTema, idUser, comment) {
        try {
            const response = await fetch('/api/comments/professor', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProblema, idTema, idUser, comment })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error submitting professor comment:', error);
        }
    }

    async function submitProfessorGrade(idProblema, idTema, idUser, grade) {
        try {
            const response = await fetch('/api/grades/professor', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProblema, idTema, idUser, grade })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error submitting professor grade:', error);
        }
    }

    function downloadJSON(obj, filename) {
        const jsonStr = JSON.stringify(obj, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    displayEvaluatedStudentName(idUser);
    fetchProblemsByTema(idTema);
});
