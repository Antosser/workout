'use strict';
var exercises = [];
var streak = 0;
var lastExeciseDate = new Date('1/1/2000');
var workoutInProgress = false;
function genUuid() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function moveUp(uuid) {
    let index = exercises.findIndex(exercise => exercise.uuid === uuid);
    if (index > 0) {
        let temp = exercises[index - 1];
        exercises[index - 1] = exercises[index];
        exercises[index] = temp;
        localStorage.setItem('ww-exercises', JSON.stringify(exercises));
        renderExercises();
    }
}
function moveDown(uuid) {
    let index = exercises.findIndex(exercise => exercise.uuid === uuid);
    if (index < exercises.length - 1) {
        let temp = exercises[index + 1];
        exercises[index + 1] = exercises[index];
        exercises[index] = temp;
        localStorage.setItem('ww-exercises', JSON.stringify(exercises));
        renderExercises();
    }
}
function renderExercises() {
    $('#exercises-table').empty();
    for (let i = 0; i < exercises.length; i++) {
        let exercise = exercises[i];
        let tr = $('<tr>');
        tr.append($(`<td><input type="text" class="form-control" placeholder="Exercise name" value="${exercise.name}"></td>`));
        tr.append($(`<td><input type="text" class="form-control" placeholder="Exercise duration" value="${exercise.duration}"></td>`));
        let deletebutton = $(`<button class="btn btn-danger" id="delete-exercise">Delete</button>`);
        deletebutton.on('click', element => {
            deleteExercise(exercise.uuid);
        });
        let butttons = $('<td><div></div></td>');
        butttons.find('div').append(deletebutton);
        butttons.find('div').append(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-arrow-down-fill" viewBox="0 0 16 16">
        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
        </svg>
        `);
        butttons.find('div').append(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-arrow-up-fill" viewBox="0 0 16 16">
        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7.5 6.707 6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707z"/>
        </svg>
        `);
        // Set the scale of the svgs to 1
        butttons.find('svg').attr('height', '36px');
        butttons.find('svg').attr('width', '36px');
        butttons.find('svg').attr('cursor', 'pointer');
        butttons.find('div').css('display', 'flex');
        butttons.find('svg').eq(1).on('click', element => {
            moveUp(exercise.uuid);
        });
        butttons.find('svg').eq(0).on('click', element => {
            moveDown(exercise.uuid);
        });
        tr.append(butttons);
        tr.attr('data-uuid', exercise.uuid);
        $('#exercises-table').append(tr);
    }
}
function flashBg(color) {
    $('body').css('background-color', color);
    setTimeout(() => {
        $('body').css('background-color', 'white');
    }, 100);
}
function updateStreak() {
    $('#streak').text(`${streak}`);
    localStorage.setItem('ww-streak', streak.toString());
}
function addStreak() {
    // If last exercise was not today add 1 to streak
    let today = new Date();
    if (today.getDate() !== lastExeciseDate.getDate()) {
        streak++;
        updateStreak();
        lastExeciseDate = today;
        localStorage.setItem('ww-lastExeciseDate', lastExeciseDate.toString());
    }
}
function doExercise(index) {
    let timer = new easytimer.Timer();
    let exercise = exercises[index];
    $('#modal-title').text('Workout');
    $('#modal-text').html(`Do <span id="exercise" class="fw-bold"></span> for <span id="time" class="fw-bold"></span>`);
    $('#showModal').trigger('click');
    if (!workoutInProgress) {
        workoutInProgress = true;
        timer.start({
            precision: 'secondTenths',
            countdown: true,
            startValues: {
                minutes: exercises[index].duration / 60,
                seconds: exercises[index].duration % 60,
            }
        });
        timer.addEventListener('secondsUpdated', function (e) {
            $('#exercise').text(exercise.name);
            $('#time').text(timer.getTimeValues().toString());
            // flashBg('yellow');
        });
        timer.addEventListener('targetAchieved', function (e) {
            // alert(`${exercise.name} is done!`);
            timer.stop();
            if (index < exercises.length - 1) {
                setTimeout(() => {
                    flashBg('green');
                    setTimeout(() => {
                        doExercise(index + 1);
                    }, 150);
                }, 150);
            }
            else {
                addStreak();
                $('#close-modal').trigger('click');
                setTimeout(() => {
                    $('#modal-title').text('Done!');
                    $('#modal-text').html(`Your steak is now <span class="fw-bold">${streak}</span>`);
                    $('#showModal').trigger('click');
                    workoutInProgress = false;
                }, 500);
            }
        });
    }
}
localStorage.setItem('ww-streak', localStorage.getItem('ww-streak') || '0');
$('#streak').text(localStorage.getItem('ww-streak'));
streak = parseInt(localStorage.getItem('ww-streak'));
localStorage.setItem('ww-exercises', localStorage.getItem('ww-exercises') || JSON.stringify(exercises));
exercises = JSON.parse(localStorage.getItem('ww-exercises'));
localStorage.setItem('ww-lastExeciseDate', localStorage.getItem('ww-lastExeciseDate') || '1/1/2000');
lastExeciseDate = new Date(localStorage.getItem('ww-lastExeciseDate') || lastExeciseDate.toString());
if (exercises.length === 0) {
    let uuid = genUuid();
    exercises.push({
        name: '',
        duration: '',
        uuid: uuid
    });
    localStorage.setItem('ww-exercises', JSON.stringify(exercises));
}
renderExercises();
$('#add').on('click', () => {
    let tr = $('<tr>');
    let uuid = genUuid();
    exercises.push({
        name: '',
        duration: '',
        uuid: uuid
    });
    renderExercises();
});
function deleteExercise(uuid) {
    if (exercises.length > 1) {
        let index = exercises.findIndex(exercise => exercise.uuid === uuid);
        if (index > -1) {
            exercises.splice(index, 1);
            localStorage.setItem('ww-exercises', JSON.stringify(exercises));
            renderExercises();
        }
    }
    else {
        $('#modal-title').text('');
        $('#modal-text').text('You must have at least one exercise');
        $('#showModal').trigger('click');
    }
}
$('#start').on('click', () => {
    // Check if exercises are valid
    let valid = true;
    exercises.forEach(exercise => {
        if (exercise.name === '') {
            valid = false;
        }
        // Check if duration is an integer
        if (exercise.duration === '' || !exercise.duration.match(/^\d+$/)) {
            valid = false;
        }
    });
    if (valid) {
        // Loop
        doExercise(0);
    }
    else {
        $('#modal-title').text('Invalid exercises');
        $('#modal-text').text('Please fill in all exercises');
        $('#showModal').trigger('click');
    }
});
setInterval(() => {
    // Loop trough $('#table-exercises')
    $('#exercises-table').find('tr').each((index, element) => {
        let tr = $(element);
        let uuid = tr.attr('data-uuid');
        let name = tr.find('input').eq(0).val();
        let duration = tr.find('input').eq(1).val();
        if (name !== '' && duration !== '') {
            if (index > -1) {
                exercises[index].name = name;
                exercises[index].duration = duration;
            }
        }
        localStorage.setItem('ww-exercises', JSON.stringify(exercises));
    });
    // If last exercise was earlier than yesterday reset streak
    if (lastExeciseDate.getDate() < new Date().getDate() - 1) {
        streak = 0;
        updateStreak();
    }
}, 100);
