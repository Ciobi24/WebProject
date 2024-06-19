// loadCategories10.js
import categories from './categories.js';

document.addEventListener('DOMContentLoaded', function () {
    const classType = 'clasa10'; // Specifica clasa pentru care se încarcă categoriile
    const containerMare = document.querySelector('.container-mare');
    const categoriesList = categories[classType];

    categoriesList.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'categorie';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'titlu';

        const link = document.createElement('a');
        link.href = `/home/probleme-clasa-10/${category.toLowerCase().replace(/ /g, '-')}`;
        link.textContent = category;

        titleDiv.appendChild(link);
        categoryDiv.appendChild(titleDiv);
        containerMare.appendChild(categoryDiv);
    });
});
