
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/user', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const user = JSON.parse(xhr.responseText);
                    const isAdmin = user.role === 'admin';

                    const adminLinkSidebar = document.querySelector('.sidebar a[href="/home/administrare"]');
                    const adminLinkMenu = document.querySelector('.menu a[href="/home/administrare"]');

                    if (isAdmin) {
                        adminLinkSidebar.style.display = 'block';
                        adminLinkMenu.style.display = 'block';
                    } else {
                        adminLinkSidebar.style.display = 'none';
                        adminLinkMenu.style.display = 'none';
                    }
                } else {
                    console.error('Failed to fetch user data');
                }
            }
        };
        xhr.send();
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
