document.addEventListener('DOMContentLoaded', async function() {
  const urlPath = window.location.pathname;
  const parts = urlPath.split('/');
  const categorie = parts[parts.length - 1];

  async function fetchAndDisplayProbleme() {
      try {
          const response = await fetch(`/api/problemeByCategorie?categorie=${categorie}`);
          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }
          const probleme = await response.json();
          displayProbleme(probleme);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  async function fetchUserById(userId) {
      try {
          const response = await fetch(`/api/user?id=${userId}`);
          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }
          const user = await response.json();
          return user.firstname + ' ' + user.lastname; // assuming user object has firstname and lastname
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
                  <button>Share</button>
                  <div class="ratings">
                      <span class="stars">★★★☆☆</span> 
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
  }

  fetchAndDisplayProbleme();
});
