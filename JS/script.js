// Import header and footer
$(function() {
    $("#import-header").load("./header.html");
    $("#import-footer").load("./footer.html");
});


//---------------------------------------------------------------
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


//---------------------------------------------------------------------
// API integration (using a mix of JS and jQuery)
const api_url = "http://api.quotable.io/random?tags=technology";
const $quote = $('#quote');
const $author = $('#author');

async function getquote(url){
    try {
        const response = await fetch(url);
        var data = await response.json();
        $quote.html(data.content);
        $author.html(data.author);
    }
    catch(error) {
        $quote.html("Could not fetch quote.");
        $author.html("Could not fetch author");
        console.error("Error fetching quote:", error);
    }
}

getquote(api_url);


//------------------------------------------------------------------------
// Collecting form information
$(document).ready(function() {
    $('#contact-us-form').on('submit', function (e) {
        e.preventDefault();
        
        const formData = {
            name: $('#sender-name').val(),
            email: $('#sender-email').val(),
            subject: $('#contact-subject').val(),
            message: $('#message').val()
        }

        console.log('Contact Form Submission:', formData);

        const alertMessage = 
            `Thank you for your message! You've sent us the following information:\n\n` +
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Subject: ${formData.subject}\n` +
            `Message: ${formData.message}\n` +
            `We will reach out as soon as possible!`;

        alert(alertMessage);

        this.reset();
    });
});


// -------------------------------------------------------------------------------------------
// Scroll button to top

$(function() {
    $('#scrolltotop').load("./scrollbutton.html");
})