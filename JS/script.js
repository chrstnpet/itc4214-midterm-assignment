// Import header and footer
$(function() {
    $("#import-header").load("./header.html");
    $("#import-footer").load("./footer.html");
});

//---------------------------------------------------------------
// API integration
const api_url = "http://api.quotable.io/random?tags=technology";
const $quote = $('#quote');
const $author = $('#author');

async function getquote(url){
    try {
        const response = await fetch(url);  
        var data = await response.json();
        quote.innerHTML = data.content;
        author.innerHTML = data.author;
    }
    catch(error) {
        $quote.html("Could not fetch quote.");
        $author.html("Could not fetch author");
        console.error("Error fetching quote:", error);
    }
}

getquote(api_url);

//---------------------------------------------------------------
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