document.addEventListener('DOMContentLoaded', function () {
    const problemsContainer = document.querySelector('.probleme');
    problemsContainer.addEventListener('click', function (event) {
        const target = event.target;
        if (target.tagName === 'H1') {
            const problemDiv = target.closest('.problema');
            const modal = document.getElementById('problemModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalCerinta = document.getElementById('modalCerinta');
            const modalTags = document.getElementById('modalTags');
            const modalAutor = document.getElementById('modalAutor');

            modalTitle.textContent = target.textContent;
            modalCerinta.textContent = problemDiv.querySelector('.cerinta').textContent;
            modalTags.innerHTML = problemDiv.querySelector('.tags').innerHTML;
            modalAutor.textContent = problemDiv.querySelector('.autor').textContent;

            modal.style.display = 'block';
        }
    });
});

function closeModal() {
    const modal = document.getElementById('problemModal');
    modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('problemModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
