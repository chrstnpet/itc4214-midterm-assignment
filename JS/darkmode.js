// Dark mode implementation

function enableDarkmode() {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

function disableDarkmode() {
    document.body.classList.remove('darkmode');
    localStorage.removeItem('darkmode');
}

if (localStorage.getItem('darkmode') === 'active') {
    enableDarkmode();
}

$(document).on('click', '#theme-switch', function() {
    const darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
});