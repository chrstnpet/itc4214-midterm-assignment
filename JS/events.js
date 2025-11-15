// --------------------------------------------------------------------------------
// Main stuff
const EventManager = {
    events: JSON.parse(localStorage.getItem('events') || '[]'),

    add(event) {
        this.events.push(event);
        this.save();
        this.renderCard(event);
    },

    delete(eventId) {
        this.events = this.events.filter(e => e.id !== eventId);
        this.save();
    },

    save() {
        localStorage.setItem('events', JSON.stringify(this.events));
    },

    // --------------------------------------------------------------------------------
    // Creates event card
    renderCard(event) {
        const htmlDescription = marked.parse(event.description);
        const card = `
            <div class="event-card" data-id="${event.id}" data-date="${event.date}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h1 class="fs-4 fw-bold mb-1">${event.title}</h1>
                        <p class="small mb-0">${new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div id="cardButtons" class="d-flex gap-2">
                        <button class="btn learn-more-btn" aria-label="Learn More button">Learn More</button>
                        <button class="btn google-calendar-btn" title="Add to Google Calendar" aria-label="Add event to your Google Calendar">
                            <i class="bi bi-calendar2-plus" aria-hidden="true"></i>
                            Add to Google Calendar
                        </button>
                        <button class="btn delete-btn" aria-label="Delete event button">
                            <i class="bi bi-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="event-description">${htmlDescription}</div>
            </div>
        `;
        $('.eventsContainer').append(card);
    },

    loadAll() {
        this.events.forEach(event => this.renderCard(event));
    }
};

// --------------------------------------------------------------------------------
// Initial Load
EventManager.loadAll();

// --------------------------------------------------------------------------------
// Add event through form
$('.modal form').on('submit', function (e) {
    e.preventDefault();

    const title = $('#eventTitle').val().trim();
    const date = $('#eventDate').val();
    const description = $('#eventDescription').val();

    if (!title || !date) {
        alert('Please fill in title and date.');
        return;
    }

    const newEvent = {
        id: Date.now(),
        title,
        date,
        description
    };

    EventManager.add(newEvent);

    this.reset();
    const modal = bootstrap.Modal.getInstance($('#eventModal'));
    modal.hide();
});

// --------------------------------------------------------------------------------
// Learn More button
$(document).on('click', '.learn-more-btn', function () {
    const $btn = $(this);
    const $desc = $btn.closest('.event-card').find('.event-description');

    if ($desc.is(':visible')) {
        $desc.slideUp(200);
        $btn.text('Learn More');
    } else {
        $desc.slideDown(200);
        $btn.text('Close Description');
    }
});

// --------------------------------------------------------------------------------
// Deleting an event
$(document).on('click', '.delete-btn', function () {
    const $card = $(this).closest('.event-card');
    const eventId = $card.data('id');

    EventManager.delete(eventId);

    $card.slideUp(200, function () {
        $(this).remove();
    });
});

// --------------------------------------------------------------------------------
// Google Calendar Integration -> adding the option to add the event to one's google calendar ^_^
function formatDateUTC(date) {
    return date.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
}

$(document).on('click', '.google-calendar-btn', function () {
    const $card = $(this).closest('.event-card');
    const title = $card.find('h4').text();
    const description = $card.find('.event-description').text();

    const startDate = new Date($card.data('date'));
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1-hour default

    const start = formatDateUTC(startDate);
    const end = formatDateUTC(endDate);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`;
    window.open(url, '_blank');
});

// --------------------------------------------------------------------------------
// Photo Gallery (clicking on photos opens them and we can go through them)
let galleryImages = [];
let currentIndex = 0;

$(function() {
    $("#import-photos").load("./photos.html", function() {
        galleryImages = $('#import-photos img').toArray();

        $(galleryImages).click(function() {
            currentIndex = galleryImages.indexOf(this);
            openFullImage($(this).attr('src'));
        });
    });
});

function openFullImage(pic) {
    $('#fullImgBox').css('display', 'flex');
    $('#fullImg').attr('src', pic);
    updateArrows();
}

function closeFullImage() {
    $('#fullImgBox').css('display', 'none');
    zoomLevel = 1;
    $('#fullImg').css('transform', 'scale(1)');
}

//--------------------------------------------------------------------------------
// Arrows left and right (they disappear when reaching the first and last image)
$('#prevImg').click(function() {
    if (currentIndex > 0) {
        currentIndex--;
        $('#fullImg').attr('src', $(galleryImages[currentIndex]).attr('src'));
        updateArrows();
    }
});

$('#nextImg').click(function() {
    if (currentIndex < galleryImages.length - 1) {
        currentIndex++;
        $('#fullImg').attr('src', $(galleryImages[currentIndex]).attr('src'));
        updateArrows();
    }
});

function updateArrows() {
    $('#prevImg').css('display', currentIndex === 0 ? 'none' : 'flex');
    $('#nextImg').css('display', currentIndex === galleryImages.length - 1 ? 'none' : 'flex');
}


// --------------------------------------------------------------------------------
// Extra: zoom in and out feature while pictures are open 
let zoomLevel = 1;
const zoomStep = 0.1;

$('#fullImgBox').on('wheel', function(e) {
    e.preventDefault();
    if (e.originalEvent.deltaY < 0) {
        zoomLevel = Math.max(0.7, zoomLevel - zoomStep);
    } else {
        zoomLevel = Math.min(2, zoomLevel + zoomStep);
    }
    $('#fullImg').css('transform', `scale(${zoomLevel})`);
});
