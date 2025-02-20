document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    loadTasks();
});

function updateTime() {
    document.getElementById('current-time').innerText = `Current Time: ${new Date().toLocaleString()}`;
}
setInterval(updateTime, 1000);

// API Simulation using localStorage
const TaskAPI = {
    getTasks: async () => JSON.parse(localStorage.getItem('tasks')) || [],
    saveTasks: async (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks)),
};

async function loadTasks() {
    const tasks = await TaskAPI.getTasks();
    renderTasks(tasks);
}

async function addTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    if (!title) { alert('Please enter a task title'); return; }
    
    const tasks = await TaskAPI.getTasks();
    tasks.push({ title, description, created_at: new Date().toISOString(), completed: false });
    await TaskAPI.saveTasks(tasks);
    
    renderTasks(tasks);
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}

async function deleteTask(index) {
    const tasks = await TaskAPI.getTasks();
    tasks.splice(index, 1);
    await TaskAPI.saveTasks(tasks);
    renderTasks(tasks);
}

async function toggleComplete(index) {
    const tasks = await TaskAPI.getTasks();
    tasks[index].completed = !tasks[index].completed;
    await TaskAPI.saveTasks(tasks);
    renderTasks(tasks);
}

function renderTasks(tasks) {
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = '';
    tasks.forEach((task, index) => {
        tasksDiv.innerHTML += `
            <div class="task ${task.completed ? 'completed' : ''}">
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p><strong>Created:</strong> ${new Date(task.created_at).toLocaleString()}</p>
                </div>
                <div>
                    <button class="complete-btn" onclick="toggleComplete(${index})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                </div>
            </div>`;
    });
    updateSummary(tasks);
}

function updateSummary(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const summaryDiv = document.getElementById('tasksSummary');
    summaryDiv.innerHTML = `
        <p><strong>Total Tasks:</strong> ${totalTasks}</p>
        <p><strong>Completed Tasks:</strong> ${completedTasks}</p>
        <p><strong>Pending Tasks:</strong> ${totalTasks - completedTasks}</p>
    `;
}
