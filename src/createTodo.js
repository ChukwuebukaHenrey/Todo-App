function createTodo(title, description, dueDate, priority) {
  return {
    title,
    description,
    dueDate,
    priority,
    id: crypto.randomUUID(),
    completed: false,
  };
}

export { createTodo };
