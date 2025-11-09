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


// -------------------------------------------------------------------------------------------
// Import photos HTML for photo gallery

let galleryImages = []; 
let currentIndex = 0; // this needed for next and prev arrows 

$(function() {
    $("#import-photos").load("./photos.html", function() {
        galleryImages = $('#import-photos img').toArray();

        $(galleryImages).click(function() {
            currentIndex = galleryImages.indexOf(this);
            openFullImage($(this).attr('src'));
            updateArrows();
        });
    });
});

function openFullImage(pic) {
    $('#fullImgBox').css('display', 'flex');
    $('#fullImg').attr('src', pic);
    updateArrows();  // update arrows visibility
}

function closeFullImage() {
    $('#fullImgBox').css('display', 'none');
    zoomLevel = 1;
    $('#fullImg').css('transform', 'scale(1)'); // See below for zoom extra !!!
}

$('#prevImg').click(function() {
    if (currentIndex > 0) {
        currentIndex--; // move to previous image
        $('#fullImg').attr('src', $(galleryImages[currentIndex]).attr('src'));
        updateArrows(); // update arrow visibility
    }
});

$('#nextImg').click(function() {
    if (currentIndex < galleryImages.length - 1) {
        currentIndex++; // move to next image
        $('#fullImg').attr('src', $(galleryImages[currentIndex]).attr('src'));
        updateArrows(); // update arrow visibility
    }
});

function updateArrows() {
    if (currentIndex === 0) {
        $('#prevImg').css('display', 'none');
    } else {
        $('#prevImg').css('display', 'flex');
    }

    if (currentIndex === galleryImages.length - 1) {
        $('#nextImg').css('display', 'none');
    } else {
        $('#nextImg').css('display', 'flex');
    }
}


// -----------------------------------------------------------------------------------
// extra: zoom in and zoom out when opened image
let zoomLevel = 1;
const zoomStep = 0.1;

$('#fullImgBox').on('wheel', function(e) {
    e.preventDefault();

    if (e.originalEvent.deltaY < 0) {                         // on scrolling downward
        zoomLevel = Math.max(0.7, zoomLevel - zoomStep);
    } else {
        zoomLevel = Math.min(2, zoomLevel + zoomStep);
    }

    $('#fullImg').css('transform', `scale(${zoomLevel})`);
});
