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
        document.getElementById('problema-autor').innerText = `Autor: ${problema.creatorId}`;

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

        // Ensure the share button is referenced correctly
        const shareButton = document.getElementById('share-button');
        if (shareButton) {
            shareButton.addEventListener('click', function() {
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

    fetchProblemDetails(idProblema);
});
