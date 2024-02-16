const submitButton = document.getElementById("todo-submit");
const inputField = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoProgress = document.getElementById("progress");

const todos = []; // or localstorage

submitButton.addEventListener("click", () => {
  const todoName = inputField.value;
  if (!todoName) {
    return alert("Por favor, insira uma tarefa.");
  }

  const isEditing = inputField.hasAttribute("data-index");
  if (isEditing) {
    const index = inputField.getAttribute("data-index");
    const todo = todos[Number(index)];
    if (!todo) {
      return alert("Tarefa não encontrada!");
    }
    todo.name = todoName;
    inputField.removeAttribute("data-index");
    submitButton.innerHTML = '<i class="fas fa-plus"></i>';
    renderTodos();
  } else {
    addTodo(todoName);
  }

  inputField.value = "";
});

function addTodo(todoName) {
  const hasTodo = todos.some((todo) => todo.name === todoName);
  if (hasTodo) {
    return alert("Esta tarefa já existe!");
  }

  todos.unshift({
    name: todoName,
    done: false,
  });
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItemHTML = document.createElement("li");
    todoItemHTML.classList.add("todo-item");

    todoItemHTML.innerHTML = `
      <div class="todo-text">
        <input type="checkbox" ${
          todo.done ? "checked" : ""
        } onclick='toggleStatus(${index})'>
        <p class='${todo.done ? "done" : ""}'>${todo.name}</p>
      </div>
      <div class="todo-actions">
        <button onclick="editTodo(${index})">
          <i class="fas fa-pen"></i>
        </button>
        <button onclick="deleteTodo(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    todoList.appendChild(todoItemHTML);
  });

  const doneTodos = todos.filter((todo) => todo.done).length;
  const totalTodos = todos.length;

  todoProgress.innerHTML = totalTodos ? `${doneTodos}/${totalTodos}` : "0";
}

function toggleStatus(index) {
  const todo = todos[index];
  if (!todo) {
    return alert("Tarefa não encontrada!");
  }

  todo.done = !todo.done;
  renderTodos();
}

function editTodo(index) {
  const todo = todos[index];
  if (!todo) {
    return alert("Tarefa não encontrada!");
  }

  inputField.setAttribute("data-index", index);
  inputField.value = todo.name;
  submitButton.innerHTML = `<i class='fas fa-save'></i>`;
}

async function deleteTodo(index) {
  const confirmDelete = await swal({
    title: "Tem certeza?",
    text: "Uma vez deletada, você não poderá recuperar esta tarefa!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });


  if (confirmDelete) {

    todos.splice(index, 1);
    renderTodos();


    swal("Pronto! Sua tarefa foi deletada! 😁🖐️", {
      icon: "success",
    });
  }
}
