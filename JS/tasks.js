// Load and save tasks to local storage functions
function loadTasks() { 
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
    tasks.forEach(task => renderTaskCard(task)); 
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

loadTasks();
updateTaskProgress();

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
    updateTaskProgress();

    return card;
}

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
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert("Due date cannot be in the past!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (editTaskId === null && tasks.length >= 20) {
        alert('Maximum of 20 tasks reached. Please delete at least one task before adding a new one.');
        return;
    }

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

    location.reload(true);
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
    updateTaskProgress();
    location.reload(true);
});

// ------------------------------------------------------------------------------------------
// Editing card content
$(document).on('click', '.edit-btn', function () {
    const $card = $(this).closest('.task-card');
    const taskId = $card.data('id');
    editTaskId = taskId;

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    $('#taskTitle').val(task.title);
    $('#taskOwner').val(task.ownerName);
    $('#taskDueDate').val(task.date);
    $('#taskDescription').val(task.description);
    $('#taskStatus').val(task.status);
    $('#taskPriority').val(task.priority);

    $('#taskModal form').off('submit').on('submit', handleFormSubmit);

    const modal = new bootstrap.Modal(document.querySelector('#taskModal'));
    modal.show();
    updateTaskProgress();
});


// ----------------------------------------------------------------------------------
// Handling category options
const radios = $('.status-option');
const pending = $('#pending-tasks');
const inProgress = $('#inprogress-tasks');
const done = $('#done-tasks');

function resetCols() {
  [pending, inProgress, done].forEach(div => {
    div.className = 'col col-12 col-sm-12 col-md-6 col-lg-4';
  });
}

radios.on('change', function() {
    if ($('#opt-1').is(':checked')) {
        pending.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        inProgress.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        done.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        $('.task-card').css({ padding: '4%', height: 'none' });
    } else if ($('#opt-2').is(':checked')) {
        pending.show().removeClass().addClass('col col-12');
        inProgress.hide().removeClass().addClass('display: none;');
        done.hide().removeClass().addClass('display: none;');
        $('.task-card').css({ padding: '2%', height: '20vh' });
    } else if ($('#opt-3').is(':checked')) {
        inProgress.show().removeClass().addClass('col col-12');
        pending.hide().removeClass().addClass('display: none;');
        done.hide().removeClass().addClass('display: none;');
        $('.task-card').css({ padding: '2%', height: '20vh' });
    } else if ($('#opt-4').is(':checked')) {
        done.show().removeClass().addClass('col col-12');
        inProgress.hide().removeClass().addClass('display: none;');
        pending.hide().removeClass().addClass('display: none;');
        $('.task-card').css({ padding: '2%', height: '20vh' });
    }
});

// --------------------------------------------------------------------------------------------
// Sorting
function sortTasks(sortoption) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if(sortoption === 'date') {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortoption === 'title') {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    $('.task-cards.pending, .task-cards.inprogress, .task-cards.done').empty();
    tasks.forEach(task => renderTaskCard(task));
}

$('#sortingOptions').on('change', function() {
    const option = $('#sortingOptions').val();

    if(option === 'random') {
        location.reload(true);
    } else {
        sortTasks(option);
    }
});

// ----------------------------------------------------------------------------------
// Counting tasks for dashboard
function updateTaskProgress() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const total = tasks.length;

    if (total === 0) {
        return;
    }

    //Counting for bar chart
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const inProgressCount = tasks.filter(t => t.status === 'inprogress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;

    const pendingPercent = total ? Math.round((pendingCount / total) * 100) : 0;
    const inProgressPercent = total ? Math.round((inProgressCount / total) * 100) : 0;
    const donePercent = total ? Math.round((doneCount / total) * 100) : 0;

    $('#dashboard .task-progress:nth-child(1) progress').attr('value', pendingPercent);
    $('#dashboard .task-progress:nth-child(2) progress').attr('value', inProgressPercent);
    $('#dashboard .task-progress:nth-child(3) progress').attr('value', donePercent);

    $('#dashboard .task-progress:nth-child(1) p').text(`Pending: ${pendingPercent}%`);
    $('#dashboard .task-progress:nth-child(2) p').text(`In Progress: ${inProgressPercent}%`);
    $('#dashboard .task-progress:nth-child(3) p').text(`Done: ${donePercent}%`);

    //Counting for pie-chart
    const highCount = tasks.filter(t => t.priority === 'high').length;
    const mediumCount = tasks.filter(t => t.priority === 'medium').length;
    const lowCount = tasks.filter(t => t.priority === 'low').length;

    const highPercent = (highCount / total) * 100;
    const mediumPercent = (mediumCount / total) * 100;

    const highDeg = (highPercent / 100) * 360;
    const mediumDeg = (mediumPercent / 100) * 360;

    const pieGradient = `
        conic-gradient(
            var(--high) 0deg ${highDeg}deg,
            var(--medium) ${highDeg}deg ${highDeg + mediumDeg}deg,
            var(--low) ${highDeg + mediumDeg}deg 360deg
        )
    `;
    document.querySelector('.piechart').style.backgroundImage = pieGradient;
}