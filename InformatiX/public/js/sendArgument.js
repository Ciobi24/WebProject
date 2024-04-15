function updateLinks() {
    const userType = getUrlParam('userType');
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        if (!href.includes('index.html')) {
          if (href.includes('?')) {
            link.setAttribute('href', `${href}&userType=${userType}`);
          } else {
            link.setAttribute('href', `${href}?userType=${userType}`);
          }
        }
      }
    });
  }
  
      function getUrlParam(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
      }
  
      document.addEventListener('DOMContentLoaded', function () {
        updateLinks();
      });