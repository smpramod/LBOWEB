window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTask(task.text, task.completed));
};

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  createTask(taskText);
  saveTask(taskText);
  taskInput.value = "";
}

function createTask(text, isCompleted = false) {
  const li = document.createElement("li");

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = isCompleted;
  checkBox.onchange = () => {
    li.classList.toggle("completed");
    updateTaskStatus(text, checkBox.checked);
  };

  const span = document.createElement("span");
  span.textContent = text;
  if (isCompleted) li.classList.add("completed");

  const delBtn = document.createElement("button");
  delBtn.textContent = "DELETE";
  delBtn.onclick = () => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      li.remove();
      deleteTask(text);
    }
  };

  li.appendChild(checkBox);
  li.appendChild(span);
  li.appendChild(delBtn);
  document.getElementById("taskList").appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: task, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStatus(taskText, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(t => t.text === taskText);
  if (index !== -1) {
    tasks[index].completed = completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}




/*function ADDTASK(){
    const taskInput=document.getElementById("taskInput");
    const taskText=taskInput.value.trim();
    if(taskText===" ")return;

    const li=document.createElement("li");
    li.textContent=taskText;

    const delBtn=document.createElement("button");
    delBtn.textContent="DELETE";
    delBtn.onclick=()=>li.remove();

    li.appendChild(delBtn);
    document.getElementById("taskList").appendChild(li);

    taskInput.value=""
}*/