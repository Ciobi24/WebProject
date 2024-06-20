document.addEventListener('DOMContentLoaded', function() {
  const urlPath = window.location.pathname;
  const parts = urlPath.split('/');
  const categorie = parts[parts.length - 1];

  async function fetchAndDisplayProbleme() {
      try {
          const response = await fetch(`/api/problemeByCategorie?categorie=${categorie}`);
          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }
          let probleme = await response.json();
          
          // Filter problems that are verified
          probleme = probleme.filter(problema => problema.verified);

          displayProbleme(probleme);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }
//check this
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

  async function displayProbleme(probleme) {
      const container = document.querySelector('.probleme');
      container.innerHTML = '';

      for (const problema of probleme) {
          const authorName = await fetchUserById(problema.creatorId);

          const problemaHTML = `
              <div class="problema">
                  <h1>${problema.nume_problema}</h1>
                  <button class="share-button">Share</button>
                  <div class="ratings">
                      <span class="stars">${problema.rating}★</span> 
                      <span class="users-tried">${problema.utilizatori_incercat} încercări</span>
                      <span class="users-solved">${problema.utilizatori_rezolvat} rezolvări</span>
                  </div>
                  <p class="cerinta">${problema.text_problema}</p>
                  <div class="tags">
                      <p>${problema.categorie}</p>
                      <p>${problema.dificultate}</p>
                  </div>
                  <p class="autor">Autor: ${authorName}</p>
              </div>
          `;
          container.insertAdjacentHTML('beforeend', problemaHTML);
      }

      // Add event listeners to the share buttons after they are inserted into the DOM
      document.querySelectorAll('.share-button').forEach(button => {
          button.addEventListener('click', function() {
              const problemaElement = this.closest('.problema');
              const problemaData = {
                  nume_problema: problemaElement.querySelector('h1').textContent,
                  rating: problemaElement.querySelector('.stars').textContent,
                  utilizatori_incercat: problemaElement.querySelector('.users-tried').textContent,
                  utilizatori_rezolvat: problemaElement.querySelector('.users-solved').textContent,
                  text_problema: problemaElement.querySelector('.cerinta').textContent,
                  categorie: problemaElement.querySelector('.tags p:nth-child(1)').textContent,
                  dificultate: problemaElement.querySelector('.tags p:nth-child(2)').textContent,
                  autor: problemaElement.querySelector('.autor').textContent,
              };
              downloadJSON(problemaData, `${problemaData.nume_problema}.json`);
          });
      });
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

  fetchAndDisplayProbleme();
});
