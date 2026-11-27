function createProject(name) {
  return {
    id: crypto.randomUUID(),
    name,
    todos: [],
  };
}

function displayProject(project, container) {
  const card = document.createElement("button");
  card.type = "button";
  card.classList.add("project");
  card.dataset.projectId = project.id;

  const heading = document.createElement("span");
  heading.classList.add("project-name");
  heading.textContent = project.name;

  const count = document.createElement("span");
  count.classList.add("project-count");
  count.textContent = `${project.todos.length} ${
    project.todos.length === 1 ? "todo" : "todos"
  }`;

  card.append(heading, count);
  container.append(card);
}

export { createProject, displayProject };
