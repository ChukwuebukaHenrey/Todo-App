import { createProject } from "./projects.js";
import { createTodo } from "./createTodo.js";
import { displayTodo } from "./displayTodo.js";

function makeDialog(className) {
  const dialog = document.createElement("dialog");
  dialog.classList.add(className);
  document.body.append(dialog);
  return dialog;
}

function makeCloseButton(dialog) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("secondary-button");
  button.textContent = "Close";
  button.addEventListener("click", () => dialog.close());
  return button;
}

function setupDialogs(projectList, newProjectButton, projects, onChange) {
  let selectedProject = null;
  let selectedTodo = null;

  const projectDialog = makeDialog("app-dialog");
  const projectHeading = document.createElement("h2");
  const todoList = document.createElement("div");
  todoList.classList.add("dialog-todo-list");
  const addTodoButton = document.createElement("button");
  addTodoButton.type = "button";
  addTodoButton.textContent = "Add todo";
  projectDialog.append(
    projectHeading,
    todoList,
    addTodoButton,
    makeCloseButton(projectDialog),
  );

  const todoDialog = makeDialog("app-dialog");
  const todoHeading = document.createElement("h2");
  const todoDescription = document.createElement("p");
  const todoDueDate = document.createElement("p");
  const todoPriority = document.createElement("p");
  const todoStatus = document.createElement("p");
  const toggleStatusButton = document.createElement("button");
  toggleStatusButton.type = "button";
  const deleteTodoButton = document.createElement("button");
  deleteTodoButton.type = "button";
  deleteTodoButton.classList.add("danger-button");
  deleteTodoButton.textContent = "Delete todo";
  const backToProjectButton = document.createElement("button");
  backToProjectButton.type = "button";
  backToProjectButton.classList.add("secondary-button");
  backToProjectButton.textContent = "Back to project";
  todoDialog.append(
    todoHeading,
    todoDescription,
    todoDueDate,
    todoPriority,
    todoStatus,
    toggleStatusButton,
    deleteTodoButton,
    backToProjectButton,
    makeCloseButton(todoDialog),
  );

  const addTodoDialog = makeDialog("app-dialog");
  const addTodoHeading = document.createElement("h2");
  addTodoHeading.textContent = "Add a todo";
  const addTodoForm = makeTodoForm();
  addTodoDialog.append(
    addTodoHeading,
    addTodoForm,
    makeCloseButton(addTodoDialog),
  );

  const addProjectDialog = makeDialog("app-dialog");
  const addProjectHeading = document.createElement("h2");
  addProjectHeading.textContent = "Create a project";
  const addProjectForm = makeProjectForm();
  addProjectDialog.append(
    addProjectHeading,
    addProjectForm,
    makeCloseButton(addProjectDialog),
  );

  function renderProjectDetails() {
    if (!selectedProject) return;

    projectHeading.textContent = selectedProject.name;
    todoList.replaceChildren();

    if (selectedProject.todos.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No todos in this project yet.";
      todoList.append(emptyMessage);
    } else {
      selectedProject.todos.forEach((todo) => displayTodo(todo, todoList));
    }
  }

  function renderTodoDetails() {
    if (!selectedTodo) return;

    todoHeading.textContent = selectedTodo.title;
    todoDescription.textContent = selectedTodo.description;
    todoDueDate.textContent = `Due date: ${selectedTodo.dueDate || "Not set"}`;
    todoPriority.textContent = `Priority: ${selectedTodo.priority}`;
    todoStatus.textContent = selectedTodo.completed
      ? "Status: Completed"
      : "Status: Not completed";
    toggleStatusButton.textContent = selectedTodo.completed
      ? "Mark as not completed"
      : "Mark as completed";
  }

  projectList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const projectCard = event.target.closest(".project");
    if (!projectCard || !projectList.contains(projectCard)) return;

    selectedProject = projects.find(
      (project) => project.id === projectCard.dataset.projectId,
    );
    if (!selectedProject) {
      throw new Error("Could not find the selected project.");
    }

    renderProjectDetails();
    projectDialog.showModal();
  });

  todoList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const todoCard = event.target.closest(".todo-container");
    if (!todoCard || !selectedProject) return;

    selectedTodo = selectedProject.todos.find(
      (todo) => todo.id === todoCard.dataset.todoId,
    );
    if (!selectedTodo) {
      throw new Error("Could not find the selected todo.");
    }

    renderTodoDetails();
    projectDialog.close();
    todoDialog.showModal();
  });

  addTodoButton.addEventListener("click", () => {
    if (!selectedProject) {
      throw new Error("Select a project before adding a todo.");
    }
    addTodoForm.reset();
    addTodoDialog.showModal();
  });

  addTodoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedProject) {
      throw new Error("Select a project before adding a todo.");
    }

    const formData = new FormData(addTodoForm);
    const todo = createTodo(
      String(formData.get("title")).trim(),
      String(formData.get("description")).trim(),
      String(formData.get("dueDate")),
      String(formData.get("priority")),
    );
    selectedProject.todos.push(todo);
    onChange();
    addTodoDialog.close();
    renderProjectDetails();
  });

  toggleStatusButton.addEventListener("click", () => {
    if (!selectedTodo) return;
    selectedTodo.completed = !selectedTodo.completed;
    onChange();
    renderTodoDetails();
  });

  deleteTodoButton.addEventListener("click", () => {
    if (!selectedProject || !selectedTodo) return;
    selectedProject.todos = selectedProject.todos.filter(
      (todo) => todo.id !== selectedTodo.id,
    );
    selectedTodo = null;
    onChange();
    todoDialog.close();
    renderProjectDetails();
    projectDialog.showModal();
  });

  backToProjectButton.addEventListener("click", () => {
    todoDialog.close();
    renderProjectDetails();
    projectDialog.showModal();
  });

  newProjectButton.addEventListener("click", () => {
    addProjectForm.reset();
    addProjectDialog.showModal();
  });

  addProjectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addProjectForm);
    const name = String(formData.get("name")).trim();
    if (!name) return;

    projects.push(createProject(name));
    onChange();
    addProjectDialog.close();
  });
}

function makeTodoForm() {
  const form = document.createElement("form");
  form.classList.add("dialog-form");

  form.append(
    makeField("Title", "title", "text", { required: true }),
    makeField("Description", "description", "textarea"),
    makeField("Due date", "dueDate", "date"),
    makePriorityField(),
  );

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Save todo";
  form.append(submit);
  return form;
}

function makeProjectForm() {
  const form = document.createElement("form");
  form.classList.add("dialog-form");
  form.append(makeField("Project name", "name", "text", { required: true }));

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Create project";
  form.append(submit);
  return form;
}

function makeField(labelText, name, type, options = {}) {
  const wrapper = document.createElement("label");
  wrapper.textContent = labelText;

  const field =
    type === "textarea"
      ? document.createElement("textarea")
      : document.createElement("input");
  if (type !== "textarea") field.type = type;
  field.name = name;
  field.required = Boolean(options.required);
  wrapper.append(field);
  return wrapper;
}

function makePriorityField() {
  const label = document.createElement("label");
  label.textContent = "Priority";
  const select = document.createElement("select");
  select.name = "priority";

  ["Low", "Medium", "High"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    select.append(option);
  });

  label.append(select);
  return label;
}

export { setupDialogs };
