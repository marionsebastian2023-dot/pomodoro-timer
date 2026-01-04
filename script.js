// Background images with study aesthetic
const backgrounds = {
    default: {
        type: 'color',
        value: '#1e1e2e'
    },
    library: {
        type: 'image',
        value: 'url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    },
    coffee: {
        type: 'image',
        value: 'url(https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    },
    notebook: {
        type: 'image',
        value: 'url(https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    }
};

function changeBackground(bgKey) {
    const bgOptions = document.querySelectorAll('.bg-option');
    bgOptions.forEach(option => option.classList.remove('active'));
    
    // Find the clicked element
    const clickedElement = event.target;
    clickedElement.classList.add('active');
    
    const background = backgrounds[bgKey] || backgrounds.default;
    
    if (background.type === 'color') {
        document.body.style.background = background.value;
        document.body.style.backgroundImage = 'none';
    } else {
        document.body.style.backgroundImage = background.value;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

// Audio for alarm
let alarmAudio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
let alarmInterval = null;

// Toggle sidebar collapse
document.getElementById('collapse-btn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    this.textContent = document.getElementById('sidebar').classList.contains('collapsed') ? '≡' : '×';
});

// Clock functionality
function updateTime() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById("current-time").textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateTime, 1000);
updateTime();

// Quotes functionality
const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The key to success is to focus on goals, not obstacles.",
    "Your focus determines your reality.",
    "Stay positive, work hard, make it happen.",
    "Productivity is never an accident. It's always the result of commitment to excellence.",
    "Concentrate all your thoughts upon the work at hand.",
    "Do the hard work first. The easy work will take care of itself.",
    "Small daily improvements lead to stunning results."
];

function changeQuote() {
    const quoteElement = document.getElementById("quote");
    quoteElement.style.opacity = 0;
    
    setTimeout(() => {
        quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.style.opacity = 1;
    }, 500);
}
setInterval(changeQuote, 15000);
changeQuote();

// Time input adjustment
function changeTime(id, change) {
    const input = document.getElementById(id);
    let value = parseInt(input.value) || 0;
    value += change;
    if (value < 0) value = 0;
    input.value = value;
}

// Task list functionality
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");
    if (taskInput.value.trim() !== "") {
        let li = document.createElement("li");
        li.innerHTML = `${taskInput.value} <button class='remove-task' onclick='removeTask(this)'>X</button>`;
        taskList.appendChild(li);
        taskInput.value = "";
    }
}

function removeTask(button) {
    button.parentElement.remove();
}

// Session and Timer functionality
let sessions = [];
let currentSession = null;
let timerInterval = null;
let timeLeft = 0;
let isPaused = true;

function playAlarm() {
    alarmAudio.currentTime = 0;
    alarmAudio.play();
    alarmInterval = setInterval(() => {
        alarmAudio.currentTime = 0;
        alarmAudio.play();
    }, 2000);
}

function stopAlarm() {
    alarmAudio.pause();
    clearInterval(alarmInterval);
}

function addSessionPair() {
    const label = document.getElementById("sessionLabel").value.trim() || "Work Session";
    
    // Get work time (including seconds)
    const workHours = parseInt(document.getElementById("workHours").value) || 0;
    const workMinutes = parseInt(document.getElementById("workMinutes").value) || 0;
    const workSeconds = parseInt(document.getElementById("workSeconds").value) || 0;
    const workTime = (workHours * 3600) + (workMinutes * 60) + workSeconds;
    
    // Get break time (including seconds)
    const breakHours = parseInt(document.getElementById("breakHours").value) || 0;
    const breakMinutes = parseInt(document.getElementById("breakMinutes").value) || 0;
    const breakSeconds = parseInt(document.getElementById("breakSeconds").value) || 0;
    const breakTime = (breakHours * 3600) + (breakMinutes * 60) + breakSeconds;
    
    if (workTime > 0) {
        // Add work session
        sessions.push({
            label: label,
            time: workTime,
            type: 'work'
        });
        
        // Add break session if break time > 0
        if (breakTime > 0) {
            sessions.push({
                label: "Break Time",
                time: breakTime,
                type: 'break'
            });
        }
        
        updateSessionList();
        
        // Clear input fields
        document.getElementById("sessionLabel").value = "";
        
        // If no current session, set the first one as current
        if (!currentSession && sessions.length > 0) {
            setCurrentSession(sessions[0]);
        }
    }
}

function updateSessionList() {
    const sessionList = document.getElementById("sessionList");
    sessionList.innerHTML = "";
    
    // Group sessions into work-break pairs
    for (let i = 0; i < sessions.length; i += 2) {
        const workSession = sessions[i];
        const breakSession = sessions[i+1];
        
        const li = document.createElement("li");
        li.className = "session-pair";
        
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours}h ${minutes}m ${secs}s`;
        };
        
        let sessionHTML = `
            <div><strong>${workSession.label}</strong> (${formatTime(workSession.time)})</div>
        `;
        
        if (breakSession) {
            sessionHTML += `
                <div class="break-session">Break (${formatTime(breakSession.time)})</div>
            `;
        }
        
        sessionHTML += `<button onclick="removeSessionPair(${i})">X</button>`;
        
        li.innerHTML = sessionHTML;
        sessionList.appendChild(li);
    }
}

function removeSessionPair(index) {
    // Remove both work and break sessions
    if (index < 0 || index >= sessions.length) return;
    
    // Check if we're removing the current session
    if (currentSession && (sessions[index] === currentSession || 
        (sessions[index+1] && sessions[index+1] === currentSession))) {
        pauseTimer();
        currentSession = null;
        document.getElementById("session-name").textContent = "No active session";
        document.getElementById("timer").textContent = "00:00:00";
    }
    
    // Remove work session and break session if exists
    sessions.splice(index, (index+1 < sessions.length && sessions[index+1].type === 'break') ? 2 : 1);
    updateSessionList();
}

function setCurrentSession(session) {
    currentSession = session;
    timeLeft = session.time;
    updateTimerDisplay();
    document.getElementById("session-name").textContent = session.label;
    
    // Change color based on session type
    document.getElementById("session-name").style.color = 
        session.type === 'break' ? '#f1fa8c' : '#50fa7b';
}

function startTimer() {
    if (isPaused) {
        if (!currentSession && sessions.length > 0) {
            setCurrentSession(sessions[0]);
        }
        
        if (currentSession) {
            isPaused = false;
            timerInterval = setInterval(updateTimer, 1000);
        }
    }
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    if (currentSession) {
        timeLeft = currentSession.time;
        updateTimerDisplay();
    } else {
        document.getElementById("timer").textContent = "00:00:00";
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        sessionComplete();
    }
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById("timer").textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function sessionComplete() {
    pauseTimer();
    
    // Play alarm sound
    playAlarm();
    
    // Show alert and stop alarm when closed
    if (confirm(`${currentSession.type === 'break' ? 'Break' : 'Session'} "${currentSession.label}" completed!\n\nClick OK to continue.`)) {
        stopAlarm();
    }
    
    // Find current session index
    const index = sessions.findIndex(s => s === currentSession);
    
    // If this was the last session, clear everything
    if (index === sessions.length - 1) {
        sessions = [];
        updateSessionList();
        currentSession = null;
        document.getElementById("session-name").textContent = "No active session";
        document.getElementById("timer").textContent = "00:00:00";
        return;
    }
    
    // Otherwise move to next session
    setCurrentSession(sessions[index + 1]);
    startTimer();
}

// Initialize with default background
changeBackground('default');