function getCategorieFromUrl() {
    const urlPath = window.location.pathname;
    const parts = urlPath.split('/');
    return parts[parts.length - 1]; 
  }

  function fetchProbleme() {
    const categorie = getCategorieFromUrl();
    const url = `/api/problemeByCategorie?categorie=${encodeURIComponent(categorie)}`;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const probleme = JSON.parse(xhr.responseText);
          console.log('Probleme:', probleme);
        } else {
          console.error('Request error:', xhr.status);
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.send();
  }

  fetchProbleme();