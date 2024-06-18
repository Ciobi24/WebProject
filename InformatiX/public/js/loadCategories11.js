// loadCategories11.js
import categories from './categories.js';

document.addEventListener('DOMContentLoaded', function () {
    const classType = 'clasa11'; // Specifica clasa pentru care se încarcă categoriile
    const containerMare = document.querySelector('.container-mare');
    const categoriesList = categories[classType];

    categoriesList.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'categorie';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'titlu';

        const link = document.createElement('a');
        link.href = `/home/probleme-clasa-11/${category.toLowerCase().replace(/ /g, '-')}`;
        link.textContent = category;
        const span = document.createElement('span');
        span.className = 'nr_probleme';
        span.textContent = ' - 0 probleme';

        link.appendChild(span);
        titleDiv.appendChild(link);
        categoryDiv.appendChild(titleDiv);
        containerMare.appendChild(categoryDiv);
    });
});
