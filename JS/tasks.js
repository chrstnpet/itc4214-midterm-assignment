function loadTasks() { 
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
    tasks.forEach(task => renderTaskCard(task)); 
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

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

const ownerMap = {
    dionisia: "../Images/circle_dionisia.png",
    christina: "../Images/circle_christina.png", 
    kostas: "../Images/circle_kostas.png",
    aggelina: "../Images/circle_aggelina.png"
}

$('#taskModal form').on('submit', function(e) { 
    e.preventDefault(); 
    
    const title = $('#taskTitle').val().trim(); 
    const ownerName = $('#taskOwner').val(); 
    const date = $('#taskDueDate').val(); 
    const description = $('#taskDescription').val();
    const status = $('#taskStatus').val();
    
    if(!title || !date || !status) { 
        alert('Title, due date and status are required.'); 
        return; 
    } 
    
    const newTask = { 
        id: Date.now(), 
        title, 
        owner: ownerMap[ownerName], 
        ownerName,
        date, 
        description,
        status
    }; 
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]' );
    tasks.push(newTask); 
    saveTasks(tasks); 
    
    renderTaskCard(newTask); 
    
    this.reset(); 
    const modal = bootstrap.Modal.getInstance(document.querySelector('#taskModal')); 
    modal.hide(); 
});

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

$(document).on('click', '.complete-btn', function () {
    const $card = $(this).closest('.task-card');
    const taskId = $card.data('id');

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = 'done';

    saveTasks(tasks);

    $('#done-tasks').append($card);

    $card.closest('.col').removeClass().addClass('col col-12 col-sm-12 col-md-6 col-lg-4');
});


$(document).on('click', '.edit-btn', function () { 
    const $card = $(this).closest('.task-card'); 
    const taskId = $card.data('id'); 
    
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId); 
    if (!task) return; 
    
    $('#taskTitle').val(task.title); 
    $('#taskOwner').val(task.ownerName);
    $('#taskDueDate').val(task.date); 
    $('#taskDescription').val(task.description); 
    $('#taskStatus').val(task.status);
    
    const modalEl = document.querySelector('#taskModal'); 
    const modal = new bootstrap.Modal(modalEl); 
    modal.show(); 
    
    $('#taskModal form').off('submit').on('submit', function (e) { 
        e.preventDefault(); 
        
        const updatedTitle = $('#taskTitle').val().trim(); 
        const updatedOwnerName = $('#taskOwner').val(); 
        const updatedDate = $('#taskDueDate').val(); 
        const updatedDescription = $('#taskDescription').val(); 
        const updatedStatus = $('#taskStatus').val();
        
        if (!updatedTitle || !updatedDate || !updatedStatus) { 
            alert('Title, due date, and status are required.'); 
            return; 
        } 
        
        task.title = updatedTitle; 
        task.owner = ownerMap[updatedOwnerName]; 
        task.ownerName = updatedOwnerName; 
        task.date = updatedDate;
        task.description = updatedDescription; 
        task.status = updatedStatus;
        

        saveTasks(tasks); 

        $card.remove(); 
        renderTaskCard(task); 
        modal.hide(); 
        
        $('#taskModal form').off('submit').on('submit', function(e){ 
            e.preventDefault(); 
            
            const title = $('#taskTitle').val().trim(); 
            const ownerName = $('#taskOwner').val(); 
            const date = $('#taskDueDate').val(); 
            const description = $('#taskDescription').val(); 
            const status = $('#taskStatus').val(); 
            
            if(!title || !date || !status) { 
                alert('Title, due date and status are required.'); 
                return; 
            } 
            
            const newTask = { 
                id: Date.now(), 
                title, 
                owner: ownerMap[ownerName], 
                ownerName,
                date, 
                description, 
                status 
            }; 
            
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
            tasks.push(newTask); 
            saveTasks(tasks); 
            
            renderTaskCard(newTask); 
            
            this.reset(); 
            const modal = bootstrap.Modal.getInstance(document.querySelector('#taskModal')); 
            modal.hide(); 
        }); 
    }); 
});

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
    } else if ($('#opt-2').is(':checked')) {
        pending.show().removeClass().addClass('col col-12');
    } else if ($('#opt-3').is(':checked')) {
        inProgress.show().removeClass().addClass('col col-12');
    } else if ($('#opt-4').is(':checked')) {
        done.show().removeClass().addClass('col col-12');
    }
});