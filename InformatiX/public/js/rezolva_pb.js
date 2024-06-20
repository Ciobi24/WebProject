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

    function displayProblem(problema) {
        document.getElementById('problema-titlu').innerText = problema.nume_problema;
        document.getElementById('problema-stelute').innerText = `${problema.rating}★`;
        document.getElementById('problema-incercari').innerText = `${problema.utilizatori_incercat} încercări`;
        document.getElementById('problema-rezolvari').innerText = `${problema.utilizatori_rezolvat} rezolvări`;
        document.getElementById('problema-descriere').innerText = problema.text_problema;
        document.getElementById('problema-autor').innerText = `Autor: ${problema.creator_nume}`;

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

    async function submitRating(idProblema, ratingValue) {
        try {
            const response = await fetch(`/api/probleme/${idProblema}/rating`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: ratingValue })
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

    fetchProblemDetails(idProblema);
});
