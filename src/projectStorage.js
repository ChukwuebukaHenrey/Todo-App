import { createProject } from "./projects.js";

const STORAGE_KEY = "todo-app-projects";

function isTodo(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.dueDate === "string" &&
    typeof value.priority === "string" &&
    typeof value.completed === "boolean"
  );
}

function isProject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    Array.isArray(value.todos) &&
    value.todos.every(isTodo)
  );
}

function loadProjects() {
  const savedProjects = localStorage.getItem(STORAGE_KEY);

  if (savedProjects === null) {
    const defaultProjects = [createProject("Personal")];
    saveProjects(defaultProjects);
    return defaultProjects;
  }

  // Don't silently replace malformed saved data; that could erase the user's projects.
  const projects = JSON.parse(savedProjects);
  if (!Array.isArray(projects) || !projects.every(isProject)) {
    throw new Error("Saved project data is invalid. The stored data was not changed.");
  }

  return projects;
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export { loadProjects, saveProjects };
