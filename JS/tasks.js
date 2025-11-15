// --------------------------------------------------------------------------------
// Main stuff
const TaskManager = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
    editTaskId: null,

    add(task) {
        this.tasks.push(task);
        this.save();
        this.renderCard(task);
        this.updateProgress();
    },

    update(taskId, updatedTask) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        this.tasks[taskIndex] = updatedTask;
        this.save();
        $(`.task-card[data-id="${taskId}"]`).remove();
        this.renderCard(updatedTask);
        this.updateProgress();
    },

    delete(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.save();
        $(`.task-card[data-id="${taskId}"]`).slideUp(200, function () { $(this).remove(); });
        this.updateProgress();
    },

    markDone(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        task.status = 'done';
        this.save();
        const $card = $(`.task-card[data-id="${taskId}"]`);
        $('#done-tasks').append($card);
        this.updateProgress();
    },

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },

    loadAll() {
        this.tasks.forEach(task => this.renderCard(task));
        this.updateProgress();
    },

    // --------------------------------------------------------------------------------
    // Puts the html in the task-card divs
    renderCard(task) {
        const htmlDescription = marked.parse(task.description);
        const card = $(`
            <div class="task-card" data-id="${task.id}" data-date="${task.date}">
                <div class="d-flex justify-content-between mb-2">
                    <div> 
                        <p class="fw-bold mb-1">${task.title}</p> 
                        <p class="small mb-0">${new Date(task.date).toLocaleDateString()}</p> 
                    </div>
                    <div id="cardButtons" class="d-flex"> 
                        <button class="btn learn-more-btn" aria-label="Read task objectives">Details</button> 
                        <button class="btn delete-btn" aria-label="Delete task">
                            <i class="bi bi-trash" aria-hidden="true"></i>
                        </button> 
                        <button class="btn edit-btn" aria-label="Edit task">
                            <i class="bi bi-pencil-square" aria-hidden="true"></i>
                        </button> 
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="owner-icon"> 
                        <img src="${task.owner}" alt="Owner icon"> 
                    </div>
                    <p class="priority-label" style="background-color:var(--${task.priority}); color:black;">${task.priority}</p>
                    <button class="btn complete-btn fs-4" aria-label="Mark as complete button">
                        <i class="bi bi-check-square-fill" aria-hidden="true"></i>
                    </button> 
                </div>
                <div class="task-description" style="display:none;">${htmlDescription}</div>
            </div>
        `);

        const container = `.task-cards.${task.status}`;
        $(container).append(card);
    },

    //--------------------------------------------------------------------------------
    // When changes are made i update the dashboard progresses and pie chart
    updateProgress() {
        const total = this.tasks.length;
        if (!total) return;

        // Progress chart percentages
        const pendingCount = this.tasks.filter(t => t.status === 'pending').length;
        const inProgressCount = this.tasks.filter(t => t.status === 'inprogress').length;
        const doneCount = this.tasks.filter(t => t.status === 'done').length;

        const pendingPercent = Math.round((pendingCount / total) * 100);
        const inProgressPercent = Math.round((inProgressCount / total) * 100);
        const donePercent = Math.round((doneCount / total) * 100);

        $('#dashboard .task-progress:nth-child(1) progress').attr('value', pendingPercent);
        $('#dashboard .task-progress:nth-child(2) progress').attr('value', inProgressPercent);
        $('#dashboard .task-progress:nth-child(3) progress').attr('value', donePercent);

        $('#dashboard .task-progress:nth-child(1) p').text(`Pending: ${pendingPercent}%`);
        $('#dashboard .task-progress:nth-child(2) p').text(`In Progress: ${inProgressPercent}%`);
        $('#dashboard .task-progress:nth-child(3) p').text(`Done: ${donePercent}%`);

        // Pie chart
        const highCount = this.tasks.filter(t => t.priority === 'high').length;
        const mediumCount = this.tasks.filter(t => t.priority === 'medium').length;

        const highDeg = (highCount / total) * 360;
        const mediumDeg = (mediumCount / total) * 360;

        const pieGradient = `
            conic-gradient(
                var(--high) 0deg ${highDeg}deg,
                var(--medium) ${highDeg}deg ${highDeg + mediumDeg}deg,
                var(--low) ${highDeg + mediumDeg}deg 360deg
            )
        `;
        document.querySelector('.piechart').style.backgroundImage = pieGradient;
    }
};

// --------------------------------------------------------------------------------
// Owner and Priority Maps
const ownerMap = {
    dionisia: "../Images/circle_dionisia.png",
    christina: "../Images/circle_christina.png", 
    kostas: "../Images/circle_kostas.png",
    aggelina: "../Images/circle_aggelina.png"
};

const priorityMap = {
    low: 'var(--low)',
    medium: 'var(--medium)',
    high: 'var(--high)'
};

// --------------------------------------------------------------------------------
// Load tasks on page load
TaskManager.loadAll();

// --------------------------------------------------------------------------------
// Adding tasks by clicking on add task button
$('.task-btn').on('click', function () {
    TaskManager.editTaskId = null;
    $('#taskModal form')[0].reset();
    $('#taskModal form').off('submit').on('submit', handleFormSubmit);
});

//--------------------------------------------------------------------------------
// creates new tasks
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

    if (TaskManager.editTaskId === null && TaskManager.tasks.length >= 20) {
        alert('Maximum of 20 tasks reached. Please delete at least one task before adding a new one.');
        return;
    }

    const newTask = {
        id: TaskManager.editTaskId || Date.now(),
        title,
        owner: ownerMap[ownerName],
        ownerName,
        date,
        description,
        status,
        priority,
        priorityColor: priorityMap[priority]
    };

    if (TaskManager.editTaskId === null) {
        TaskManager.add(newTask);
    } else {
        TaskManager.update(TaskManager.editTaskId, newTask);
    }

    $('#taskModal form')[0].reset();
    const modal = bootstrap.Modal.getInstance(document.querySelector('#taskModal'));
    modal.hide();
}

// --------------------------------------------------------------------------------
// Learn More button -> displays description
$(document).on('click', '.learn-more-btn', function () { 
    const $btn = $(this); 
    const $desc = $btn.closest('.task-card').find('.task-description'); 
    if ($desc.is(':visible')) { 
        $desc.slideUp(200); 
        $btn.text('Details'); 
    } else { 
        $desc.slideDown(200); 
        $btn.text('Close'); 
    } 
});

// --------------------------------------------------------------------------------
// Delete task by clicking on delete button 
$(document).on('click', '.delete-btn', function () {
    const taskId = $(this).closest('.task-card').data('id');
    TaskManager.delete(taskId);
});

//--------------------------------------------------------------------------------
// Complete task by clikcing on the 'check' button 
$(document).on('click', '.complete-btn', function () {
    const taskId = $(this).closest('.task-card').data('id');
    TaskManager.markDone(taskId);
});

// --------------------------------------------------------------------------------
// Edit Task
$(document).on('click', '.edit-btn', function () {
    const taskId = $(this).closest('.task-card').data('id');
    TaskManager.editTaskId = taskId;

    const task = TaskManager.tasks.find(t => t.id === taskId);
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
});

// --------------------------------------------------------------------------------
// Filtering by category
const radios = $('.status-option');
const pending = $('#pending-tasks');
const inProgress = $('#inprogress-tasks');
const done = $('#done-tasks');

radios.on('change', function() {
    if ($('#opt-1').is(':checked')) {
        pending.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        inProgress.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        done.show().removeClass().addClass('col col-12 col-md-6 col-lg-4');
        $('.task-card').css({ padding: '4%', height: 'none' });
    } else if ($('#opt-2').is(':checked')) {
        pending.show().removeClass().addClass('col col-12');
        inProgress.hide();
        done.hide();
        $('.task-card').css({ padding: '2%', height: '20vh' });
    } else if ($('#opt-3').is(':checked')) {
        inProgress.show().removeClass().addClass('col col-12');
        pending.hide();
        done.hide();
        $('.task-card').css({ padding: '2%', height: '20vh' });
    } else if ($('#opt-4').is(':checked')) {
        done.show().removeClass().addClass('col col-12');
        inProgress.hide();
        pending.hide();
        $('.task-card').css({ padding: '2%', height: '20vh' });
    }
});

// --------------------------------------------------------------------------------
// Sorting by title or due date
function sortTasks(sortOption) {
    let tasks = [...TaskManager.tasks]; // copy in-memory tasks

    if(sortOption === 'date') {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if(sortOption === 'title') {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Clear all columns
    $('.task-cards.pending, .task-cards.inprogress, .task-cards.done').empty();
    tasks.forEach(task => TaskManager.renderCard(task));
}

$('#sortingOptions').on('change', function() {
    const option = $('#sortingOptions').val();
    if(option === 'random') {
        $('.task-cards.pending, .task-cards.inprogress, .task-cards.done').empty();
        TaskManager.loadAll();
    } else {
        sortTasks(option);
    }
});
