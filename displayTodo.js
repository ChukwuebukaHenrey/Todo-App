function displayTodo(todo, container) {
  const card = document.createElement("button");
  card.type = "button";
  card.classList.add("todo-container");
  card.dataset.todoId = todo.id;

  const title = document.createElement("span");
  title.classList.add("todo-title");
  title.textContent = todo.title;

  const status = document.createElement("span");
  status.classList.add("todo-status");
  status.textContent = todo.completed ? "Completed" : "Not completed";

  card.append(title, status);
  container.append(card);

  return card;
}

export { displayTodo };
