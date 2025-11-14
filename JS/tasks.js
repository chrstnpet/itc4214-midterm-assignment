// Load and save tasks to local storage functions
function loadTasks() { 
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
    tasks.forEach(task => renderTaskCard(task)); 
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}


// ------------------------------------------------------------------------------------------------
// Creating cards by adding html code into divs after collecting form information
function renderTaskCard(task) {
    const htmlDescription = marked.parse(task.description); 
    const card = $(`
        <div class="task-card" data-id="${task.id}" data-date="${task.date}">
            <div class="d-flex justify-content-between mb-2">
                <div> 
                    <p class="fw-bold mb-1">${task.title}</p> 
                    <p class="small mb-0">${new Date(task.date).toLocaleDateString()}</p> 
                </div>
                <div id="cardButtons" class="d-flex"> 
                    <button class="btn learn-more-btn">Details</button> 
                    <button class="btn delete-btn"><i class="bi bi-trash"></i></button> 
                    <button class="btn edit-btn"><i class="bi bi-pencil-square"></i></button> 
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <div class="owner-icon"> 
                    <img src="${task.owner}"> 
                </div>
                <p class="priority-label" style="background-color:var(--${task.priority}); color:black;">${task.priority}</p>
                <button class="btn complete-btn fs-4"><i class="bi bi-check-square-fill"></i></button> 
            </div>
            <div class="task-description" style="display:none;">${htmlDescription}</div>
        </div>
    `);

    const container = `.task-cards.${task.status}`;
    $(container).append(card);

    return card;
}

loadTasks();

//------------------------------------------------
// Map for inserting owner icons on cards
const ownerMap = {
    dionisia: "../Images/circle_dionisia.png",
    christina: "../Images/circle_christina.png", 
    kostas: "../Images/circle_kostas.png",
    aggelina: "../Images/circle_aggelina.png"
}

// Map for inserting priority bubble colors on cards
const priorityMap = {
    low: 'var(--low)',
    medium: 'var(--medium)',
    high: 'var(--high)'
}

//-----------------------------------------------------------
// Add task button event listener
$('.task-btn').on('click', function () {
    editTaskId = null;
    $('#taskModal form')[0].reset();

    $('#taskModal form').off('submit');

    $('#taskModal form').on('submit', handleFormSubmit);
});

//-----------------------------------------------------------
// Taking information from form modal to create new task card
function handleFormSubmit(e) {
    e.preventDefault();

    const title = $('#taskTitle').val().trim();
    const ownerName = $('#taskOwner').val();
    const date = $('#taskDueDate').val();
    const description = $('#taskDescription').val();
    const status = $('#taskStatus').val();
    const priority = $('#taskPriority').val();

    if (!title || !date || !status || !priority) {
        alert('Title, due date, status and priority are required.');
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (editTaskId === null) {
        const newTask = {
            id: Date.now(),
            title,
            owner: ownerMap[ownerName],
            ownerName,
            date,
            description,
            status,
            priority,
            priorityColor: priorityMap[priority]
        };

        tasks.push(newTask);
        saveTasks(tasks);
        renderTaskCard(newTask);

    } else {
        const task = tasks.find(t => t.id === editTaskId);
        if (!task) return;

        // Update task fields
        task.title = title;
        task.owner = ownerMap[ownerName];
        task.ownerName = ownerName;
        task.date = date;
        task.description = description;
        task.status = status;
        task.priority = priority;
        task.priorityColor = priorityMap[priority];

        saveTasks(tasks);

        $(`.task-card[data-id="${editTaskId}"]`).remove();
        renderTaskCard(task);
    }

    $('#taskModal form')[0].reset();
    const modal = bootstrap.Modal.getInstance(document.querySelector('#taskModal'));
    modal.hide();
}

$('#taskModal form').on('submit', handleFormSubmit);

//------------------------------------------------------------------------------------------
// Displaying details of task on clicking learn more button
$(document).on('click', '.learn-more-btn', function () { 
    const $btn = $(this); 
    const $desc = $btn.closest('.task-card').find('.task-description'); 
    
    if ($desc.is(':visible')) { 
        $desc.slideUp(200); 
        $btn.text('Details'); 
    } else { $desc.slideDown(200); 
        $btn.text('Close'); 
    } 
});

//--------------------------------------------------------------------------
// Deleting tasks on click of delete button
$(document).on('click', '.delete-btn', function () { 
    const $card = $(this).closest('.task-card'); 
    const taskId = $card.data('id'); 
    
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
    tasks = tasks.filter(t => t.id !== taskId); 
    saveTasks(tasks); 
    
    $card.slideUp(200, function () { 
        $(this).remove(); 
    }); 
});

// ---------------------------------------------------------------------------
// Marking tasks as done by clicking the 'check' button
$(document).on('click', '.complete-btn', function () {
    const $card = $(this).closest('.task-card');
    const taskId = $card.data('id');

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = 'done';

    saveTasks(tasks);

    $('#done-tasks').append($card);
});

// ------------------------------------------------------------------------------------------
// Editing card content
$(document).on('click', '.edit-btn', function () {
    const $card = $(this).closest('.task-card');
    const taskId = $card.data('id');
    editTaskId = taskId;  // put form in "Edit mode"

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Fill in the form fields
    $('#taskTitle').val(task.title);
    $('#taskOwner').val(task.ownerName);
    $('#taskDueDate').val(task.date);
    $('#taskDescription').val(task.description);
    $('#taskStatus').val(task.status);
    $('#taskPriority').val(task.priority);

    // Reset submit handler and reattach the unified one
    $('#taskModal form').off('submit').on('submit', handleFormSubmit);

    // Open the modal
    const modal = new bootstrap.Modal(document.querySelector('#taskModal'));
    modal.show();
});


// ----------------------------------------------------------------------------------
// Handling category options
const radios = $('.status-option');
const pending = $('#pending-tasks');
const inProgress = $('#in-progress-tasks');
const done = $('#done-tasks');

function resetCols() {
  [pending, inProgress, done].forEach(div => {
    div.className = 'col col-12 col-sm-12 col-md-6 col-lg-4';
  });
}

radios.on('change', function() {
    pending.hide();
    inProgress.hide();
    done.hide();

    if ($('#opt-1').is(':checked')) {
        pending.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        inProgress.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        done.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        $('.task-card').css({ padding: '4%', height: 'none' });
    } else if ($('#opt-2').is(':checked')) {
        pending.show().removeClass().addClass('col col-12');
        $('.task-card').css({ padding: '2%', height: '20vh' });
    } else if ($('#opt-3').is(':checked')) {
        inProgress.show().removeClass().addClass('col col-12');
        $('.task-card').css({ padding: '2%', height: '20vh' });
    } else if ($('#opt-4').is(':checked')) {
        done.show().removeClass().addClass('col col-12');
        $('.task-card').css({ padding: '2%', height: '20vh' });
    }
});

