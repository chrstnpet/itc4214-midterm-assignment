// Import header and footer
$(function() {
    $("#import-header").load("./header.html");
    $("#import-footer").load("./footer.html");
});


//---------------------------------------------------------------
// Dark mode implementation
function enableDarkmode() {
    $('body').addClass('darkmode');
    localStorage.setItem('darkmode', 'active');
}

function disableDarkmode() {
    $('body').removeClass('darkmode');
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
        $('#tech-quote').show();
        $quote.html(data.content);
        $author.html(data.author);
    }
    catch(error) {
        $('#tech-quote').hide();
        // $quote.html("Could not fetch quote.");
        // $author.html("Could not fetch author");
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

//--------------------------------------------------------------------------------------------
// Getting latest tasks for home page
$(document).ready(function() {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const pendingTasks = allTasks.filter(task => task.status === 'pending');
    const lastThreePending = pendingTasks.sort((a, b) => b.id - a.id).slice(0, 3);

    const $container = $('#latest');
    $container.empty();

    lastThreePending.forEach(task => {
        const $col = $(`
            <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <div class="activity-card p-3" style="background-color: var(--bg-color); border-radius: 10px;">
                    <img src="${task.owner}" alt="Owner icon" width="90">
                    <div>
                        <p class="fw-bold mb-1">${task.title}</p>
                        <p class="small mb-0">Due date: ${new Date(task.date).toLocaleDateString()}</p>
                        <p class="priority-label">Priority: ${task.priority}</p>
                    </div>
                </div>
            </div>
        `);
        $container.append($col);
    });
});
