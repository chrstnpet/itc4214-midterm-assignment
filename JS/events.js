function loadEvents() {
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  events.forEach(event => renderEventCard(event));
}

function saveEvents(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

function renderEventCard(event) {
  const htmlDescription = marked.parse(event.description);
  const card = `
    <div class="event-card" data-id="${event.id}" data-date="${event.date}">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h4 class="fw-bold mb-1">${event.title}</h4>
          <p class="small mb-0">${new Date(event.date).toLocaleDateString()}</p>
        </div>
        <div id="cardButtons" class="d-flex gap-2">
          <button class="btn learn-more-btn">Learn More</button>
          <button class="btn google-calendar-btn" title="Add to Google Calendar">
            <i class="bi bi-calendar2-plus"></i>
            Add to Google Calendar
          </button>
          <button class="btn delete-btn">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="event-description">${htmlDescription}</div>
    </div>
  `;
  $('.eventsContainer').append(card);
}

loadEvents();


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

  const events = JSON.parse(localStorage.getItem('events') || '[]');
  events.push(newEvent);
  saveEvents(events);

  renderEventCard(newEvent);

  this.reset();
  const modal = bootstrap.Modal.getInstance($('#eventModal'));
  modal.hide();
});


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


$(document).on('click', '.delete-btn', function () {
  const $card = $(this).closest('.event-card');
  const eventId = $card.data('id');

  let events = JSON.parse(localStorage.getItem('events') || '[]');
  events = events.filter(ev => ev.id !== eventId);
  saveEvents(events);

  $card.slideUp(200, function () {
    $(this).remove();
  });
});


function formatDateUTC(date) {
  return date.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
}

$(document).on('click', '.google-calendar-btn', function () {
  const $card = $(this).closest('.event-card');
  const title = $card.find('h4').text();
  const description = $card.find('.event-description').text();
  
  // Convert string to Date
  const startDate = new Date($card.data('date'));
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1-hour default

  const start = formatDateUTC(startDate);
  const end = formatDateUTC(endDate);

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`;
  window.open(url, '_blank');
});


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