const addButton = document.getElementById('addButton');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

addButton.addEventListener('click', async () => {
  const taskText = taskInput.value;
  if (taskText) {
    const task = { text: taskText, isCompleted: false, id: Date.now() };

    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token123',
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();
    taskInput.value = '';
    loadTasks();
  }
});

async function loadTasks() {
  const response = await fetch('http://localhost:3000/tasks');
  const tasks = await response.json();

  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'listElement';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.isCompleted;
    checkbox.className = 'check-box';
    checkbox.addEventListener('change', () => {
      updateTaskStatus(task.id, checkbox.checked);
      taskLabel.classList.toggle('completed', checkbox.checked);
    });

    const taskLabel = document.createElement('span');
    taskLabel.textContent = task.text;
    taskLabel.className = 'task-text';
    if (task.isCompleted) {
      taskLabel.classList.add('completed');
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(taskLabel);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

async function deleteTask(taskId) {
  await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token123',
    },
  });
  loadTasks();
}

async function updateTaskStatus(taskId, isCompleted) {
  await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token123',
    },
    body: JSON.stringify({ isCompleted }),
  });
}

loadTasks();
