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
          <p class="small mb-0">${new Date(event.date).toLocaleString()}</p>
        </div>
        <div id="cardButtons" class="d-flex gap-2">
          <button class="btn learn-more-btn">Learn More</button>
          <button class="btn google-calendar-btn" title="Add to Google Calendar">
            <i class="bi bi-calendar2-plus"></i>
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

function formatDateUTC(date) {
  return date.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
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


$(document).on('click', '.google-calendar-btn', function () {
  const $card = $(this).closest('.event-card');
  const title = $card.find('h4').text();
  const description = $card.find('.event-description').text();
  const dateISO = $card.data('date');

  const startDate = new Date(dateISO);
  const endDate = new Date(startDate.getTime() + 60*60*1000); // 1-hour default

  const start = formatDateUTC(startDate);
  const end = formatDateUTC(endDate);

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`;
  window.open(url, '_blank');
});
