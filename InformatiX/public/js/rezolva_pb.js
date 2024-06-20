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
        document.querySelector('.problema h1').innerText = problema.nume_problema;
        document.querySelector('.problema .stars').innerText = `${problema.rating}★`;
        document.querySelector('.problema .users-tried').innerText = `${problema.utilizatori_incercat} încercări`;
        document.querySelector('.problema .users-solved').innerText = `${problema.utilizatori_rezolvat} rezolvări`;
        document.querySelector('.problema .cerinta').innerText = problema.text_problema;
        document.querySelector('.problema .autor').innerText = `Autor: ${problema.creatorId}`;

        const tagsContainer = document.getElementById('problema-tags');
        tagsContainer.innerHTML = '';
        const tags = [problema.clasa, problema.dificultate, problema.categorie];
        tags.forEach(tag => {
            const tagElement = document.createElement('p');
            tagElement.innerText = tag;
            tagsContainer.appendChild(tagElement);
        });
    }

    fetchProblemDetails(idProblema);
});
