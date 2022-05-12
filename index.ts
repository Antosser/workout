var exercises: Exercise[] = [];
var streak = 0;
var lastExeciseDate = new Date('1/1/2000');

interface Exercise {
    name: string;
    duration: number;
    uuid: string;
}

function genUuid(): string {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function renderExercises() {
    $('#exercises').empty();
    for (let i = 0; i < exercises.length; i++) {
        let exercise = exercises[i];
        let uuid = exercise.uuid;
        $('#exercises').append(`<li uuid="${uuid}">${exercise.name} - ${exercise.duration} - <red onclick="deleteExercise('${uuid}')">Delete</red></li>`);
    }
}

function flashBg(color: string) {
    $('body').css('background-color', color);
    setTimeout(() => {
        $('body').css('background-color', 'white');
    }
    , 100);
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

function doExercise(index: number) {
    let timer = new easytimer.Timer();
    let exercise = exercises[index];
    let uuid = exercise.uuid;
    timer.start({
        precision: 'secondTenths',
        countdown: true,
        startValues: {
            minutes: exercise.duration / 60,
            seconds: exercise.duration % 60,
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
        }
    });
}

localStorage.setItem('ww-streak', localStorage.getItem('ww-streak') || '0');
$('#streak').text(localStorage.getItem('ww-streak'));
localStorage.setItem('ww-exercises', localStorage.getItem('ww-exercises') || JSON.stringify(exercises));
exercises = JSON.parse(localStorage.getItem('ww-exercises'));
localStorage.setItem('ww-lastExeciseDate', localStorage.getItem('ww-lastExeciseDate') || '1/1/2000');
lastExeciseDate = new Date(localStorage.getItem('ww-lastExeciseDate') || lastExeciseDate.toString());

// If last exercise was earlier than yesterday reset streak
if (lastExeciseDate.getDate() < new Date().getDate() - 1) {
    streak = 0;
    updateStreak();
}

renderExercises();

$('#add').on('click', () => {
    let name = prompt('Name');
    let duration = parseInt(prompt('Duration'));
    let uuid = genUuid();
    if (name && duration) {
        exercises.push({ name, duration, uuid });
        localStorage.setItem('ww-exercises', JSON.stringify(exercises));
        renderExercises();
    }
    else {
        alert('Please enter a name and duration');
    }
});

function deleteExercise(uuid: string) {
    let index = exercises.findIndex(exercise => exercise.uuid === uuid);
    if (index > -1) {
        exercises.splice(index, 1);
        renderExercises();
        localStorage.setItem('ww-exercises', JSON.stringify(exercises));
    }
}

$('#start').on('click', () => {
    // Loop
    doExercise(0);
});