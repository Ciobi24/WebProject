document.addEventListener('DOMContentLoaded', function () {
    const urlParams = window.location.pathname.split('/');
    const idTema = urlParams[4];
    const idProblema = urlParams[6];

    async function fetchProblemDetails(idProblema) {
        try {
            const response = await fetch(`/api/probleme/${idProblema}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const problema = await response.json();
            displayProblem(problema);
        } catch (error) {
            console.error('Error fetching problem data:', error);
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

    async function displayProblem(problema) {
        document.getElementById('problema-titlu').innerText = problema.nume_problema;
        document.getElementById('problema-stelute').innerText = `${problema.rating}★`;
        document.getElementById('problema-incercari').innerText = `${problema.utilizatori_incercat} încercări`;
        document.getElementById('problema-rezolvari').innerText = `${problema.utilizatori_rezolvat} rezolvări`;
        document.getElementById('problema-descriere').innerText = problema.text_problema;

        const authorName = await fetchUserById(problema.creatorId);
        document.getElementById('problema-autor').innerText = `Autor: ${authorName}`;

        const tagsContainer = document.getElementById('problema-tags');
        tagsContainer.innerHTML = '';
        const tags = [problema.clasa, problema.dificultate, problema.categorie];
        tags.forEach(tag => {
            const tagElement = document.createElement('p');
            tagElement.innerText = tag;
            tagsContainer.appendChild(tagElement);
        });

        const starElements = document.querySelectorAll('.star-rating span');
        starElements.forEach(star => {
            star.addEventListener('click', function () {
                const ratingValue = this.getAttribute('data-value');
                submitRating(idProblema, ratingValue);
                highlightStars(ratingValue);
            });
        });

        const shareButton = document.getElementById('share-button');
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
                    autor: problema.creatorId,
                };
                downloadJSON(problemaData, `${problema.nume_problema}.json`);
            });
        }

        const submitButton = document.querySelector('.rezolvare button');
        if (submitButton) {
            submitButton.addEventListener('click', async function (event) {
                event.preventDefault();
                const isDeadlineValid = await checkDeadline(idTema);
                if (!isDeadlineValid) {
                    alert('Deadline-ul temei a fost depășit. Nu mai puteți trimite rezolvarea.');
                } else {
                    submitSolution();
                }
            });
        }

        const sendCommentButton = document.getElementById('send');
        if (sendCommentButton) {
            sendCommentButton.addEventListener('click', async function (event) {
                event.preventDefault();
                const commentText = document.getElementById('comentariu').value;
                submitComment(idProblema, idTema, commentText);
            });
        }

        fetchComments(idProblema, idTema);
        fetchGrade(idProblema, idTema);
    }

    async function fetchComments(idProblema, idTema) {
        try {
            const response = await fetch(`/api/comments?idProblema=${idProblema}&idTema=${idTema}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const commentsData = await response.json();
            displayComments(commentsData, idProblema, idTema);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    async function submitComment(idProblema, idTema, comentariu) {
        try {
            const response = await fetch('/api/comments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProblema, idTema, comentariu })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            alert(result.message);
            fetchComments(idProblema, idTema);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }

    async function fetchGrade(idProblema, idTema) {
        try {
            const response = await fetch(`/api/grades?idProblema=${idProblema}&idTema=${idTema}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const gradeData = await response.json();
            displayGrade(gradeData.nota);
        } catch (error) {
            console.error('Error fetching grade:', error);
        }
    }

    function displayGrade(grade) {
        const gradeContainer = document.getElementById('nota-afisata');
        gradeContainer.innerHTML = `Nota: ${grade !== null ? grade : 'N/A'}`;
    }

    async function submitRating(idProblema, ratingValue) {
        try {
            const response = await fetch(`/api/probleme/${idProblema}/rating`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Rating: ratingValue })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    }

    async function checkDeadline(idTema) {
        try {
            const response = await fetch(`/api/teme/${idTema}/deadline`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const { deadline } = await response.json();
            const currentDate = new Date(Date.now());
            const deadlineDate = new Date(deadline);
            return currentDate <= deadlineDate;
        } catch (error) {
            console.error('Error checking deadline:', error);
            return false;
        }
    }

    async function fetchSolution(idProblema, idTema) {
        try {
            const response = await fetch(`/api/getSolution?idProblema=${idProblema}&idTema=${idTema}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            if (result.success && result.solution) {
                document.getElementById('rezolvare').value = result.solution;
            }
        } catch (error) {
            console.error('Error fetching solution:', error);
        }
    }

    async function submitSolution() {
        const urlParams = window.location.pathname.split('/');
        const idTema = urlParams[4];
        const idProblema = urlParams[6];
        const textSolutie = document.getElementById('rezolvare').value;

        try {
            const response = await fetch('/api/submitSolution', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProblema, idTema, textSolutie })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error submitting solution:', error);
        }
    }
    function highlightStars(ratingValue) {
        const starElements = document.querySelectorAll('.star-rating span');
        starElements.forEach(star => {
            if (star.getAttribute('data-value') <= ratingValue) {
                star.classList.add('highlighted');
            } else {
                star.classList.remove('highlighted');
            }
        });
    }
    function displayComments({ comments, teacherComment, currentUserId }, idProblema, idTema) {
        const commentsContainer = document.querySelector('.comments');
        commentsContainer.innerHTML = `
            <h2>Comentarii</h2>
            <div class="add_comm">
                <label for="comentariu">Adaugă comentariu</label>
                <textarea id="comentariu" name="comentariu" class="comentariu" cols="5000" rows="5000"></textarea>
                <button id="send">Trimite</button>
            </div>
        `; // Clear existing comments and add comment input field
    
        if (Array.isArray(comments) && comments.length > 0) {
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p class="autor">${comment.firstname} ${comment.lastname}</p>
                    <p class="comentariu">${comment.text}</p>
                    ${comment.id_user === currentUserId ? '<button class="delete-comment">Delete</button>' : ''}
                `;
                if (comment.id_user === currentUserId) {
                    commentElement.querySelector('.delete-comment').addEventListener('click', () => {
                        deleteComment(idProblema, idTema);
                    });
                }
                commentsContainer.appendChild(commentElement);
            });
        }
    
        if (teacherComment) {
            const teacherCommentElement = document.createElement('div');
            teacherCommentElement.classList.add('comment');
            teacherCommentElement.innerHTML = `
                <p class="autor">Teacher</p>
                <p class="comentariu">${teacherComment}</p>
            `;
            commentsContainer.appendChild(teacherCommentElement);
        }
    
        // Reattach the event listener for the comment submit button
        const sendCommentButton = document.getElementById('send');
        if (sendCommentButton) {
            sendCommentButton.addEventListener('click', async function (event) {
                event.preventDefault();
                const commentText = document.getElementById('comentariu').value;
                submitComment(idProblema, idTema, commentText);
            });
        }
    }
    async function deleteComment(idProblema, idTema) {
        try {
            const response = await fetch('/api/comments', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProblema, idTema })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            alert(result.message);
            // Optionally refetch comments to show the remaining comments
            fetchComments(idProblema, idTema);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }
    fetchProblemDetails(idProblema);
    fetchSolution(idProblema, idTema);
});
