const form = document.querySelector('form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = [];

function addTask(event) {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (text === '') return;

		const isTaskExists = tasks.find((task) => task.text.toLowerCase() === text.toLowerCase());
		if (isTaskExists) {
			alert('A tarefa já existe!');
			return;
		}

    const task = {
        id: Date.now(),
        text,
        completed: false,
    };

    tasks.push(task);
		tasks = sortTasks(tasks); // ordena as tarefas após adicionar a nova tarefa
    addTaskToDOM(task);
		updateTaskList()
    saveTasks();

    taskInput.value = '';
    taskInput.focus();
}

function updateTaskList() {
  // Obtém a lista ul
  const ul = document.querySelector('#task-list');

  // Remove todos os itens da lista
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  // Adiciona cada tarefa ordenada na lista
  for (const task of tasks) {
    addTaskToDOM(task);
  }
}

function addTaskToDOM(task) {
  const taskItem = document.createElement('li');
  taskItem.dataset.taskId = task.id;

  const taskText = document.createElement('span');
  taskText.textContent = task.text;

  const editButton = document.createElement('button');
  editButton.textContent = 'Editar';
  editButton.classList.add('edit');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.classList.add('delete');

  const completeCheckbox = document.createElement('input');
  completeCheckbox.type = 'checkbox';
  completeCheckbox.checked = task.completed;
  completeCheckbox.classList.add('complete');

  if (task.completed) {
    taskItem.classList.add('complete');
  }

  taskItem.appendChild(completeCheckbox);
  taskItem.appendChild(taskText);
  taskItem.appendChild(editButton);
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);

  editButton.addEventListener('click', editTask);
  deleteButton.addEventListener('click', deleteTask);
  completeCheckbox.addEventListener('change', toggleComplete);
}

function sortTasks(tasks) {
  const sortedTasks = tasks.sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    } else if (!a.completed && b.completed) {
      return -1;
    } else {
      return a.text.localeCompare(b.text);
    }
  });

  return sortedTasks;
}

function editTask(event) {
    const taskItem = event.target.parentNode;
    const taskId = parseInt(taskItem.dataset.taskId);

    const taskText = taskItem.querySelector('span');
    const editText = prompt('Editar tarefa', taskText.textContent);

    if (editText === null || editText.trim() === '') return;

    const index = tasks.findIndex(task => task.id === taskId);
    tasks[index].text = editText.trim();
    saveTasks();

    taskText.textContent = editText.trim();
}

function deleteTask(event) {
    const taskItem = event.target.parentNode;
    const taskId = parseInt(taskItem.dataset.taskId);

    const index = tasks.findIndex(task => task.id === taskId);
    tasks.splice(index, 1);
    saveTasks();

    taskItem.remove();
}

function toggleComplete(event) {
    const taskItem = event.target.parentNode;
    const taskId = parseInt(taskItem.dataset.taskId);

    const index = tasks.findIndex(task => task.id === taskId);
    tasks[index].completed = event.target.checked;
    saveTasks();
		tasks = sortTasks(tasks); // adiciona a chamada para a função sortTasks()
		updateTaskList() // adiciona a chamada para a função updateTaskList()

    taskItem.classList.toggle('complete');
		taskItem.style.backgroundColor = event.target.checked ? '#7FFF7F' : '';
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
				tasks = sortTasks(tasks); // Ordena as tarefas após carregar do localStorage
        tasks.forEach(addTaskToDOM);
    }
}

form.addEventListener('submit', addTask);

loadTasks();
