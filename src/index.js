import { createProject, displayProject } from "./projects.js";
import { loadProjects, saveProjects } from "./projectStorage.js";
import { setupDialogs } from "./dialog.js";
import "./style.css";

const projectList = document.querySelector("#project-list");
const newProjectButton = document.querySelector("#new-project");

if (!(projectList instanceof HTMLElement)) {
  throw new Error("Could not find the project list element (#project-list).");
}

if (!(newProjectButton instanceof HTMLButtonElement)) {
  throw new Error("Could not find the new project button (#new-project).");
}

const projects = loadProjects();

function renderProjects() {
  projectList.replaceChildren();
  projects.forEach((project) => displayProject(project, projectList));
}

function saveAndRenderProjects() {
  saveProjects(projects);
  renderProjects();
}

renderProjects();
setupDialogs(projectList, newProjectButton, projects, saveAndRenderProjects);
