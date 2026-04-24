const API = window.location.origin;

// DOM Elements
const messageEl = document.getElementById('message');
const createForm = document.getElementById('create-form');
const editForm = document.getElementById('edit-form');
const editSection = document.getElementById('edit-section');
const cancelEditBtn = document.getElementById('cancel-edit');
const todoListEl = document.getElementById('todo-list');

// Helper to show messages
function showMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.className = `message ${isError ? 'error' : 'success'}`;
    messageEl.classList.remove('hidden');
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 4000);
}

// Fetch and render todo list
async function loadTodos() {
    try {
        const resp = await fetch(`${API}/todos`);
        if (!resp.ok) throw new Error('Failed to fetch todos');
        const todos = await resp.json();
        renderTodoList(todos);
    } catch (err) {
        showMessage(err.message, true);
    }
}

function renderTodoList(todos) {
    todoListEl.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = todo.id;
        li.innerHTML = `
            <span class="todo-title">${escapeHtml(todo.title)}</span>
            <p class="todo-desc">${escapeHtml(todo.description)}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        // Edit handler
        li.querySelector('.edit-btn').addEventListener('click', () => startEditTodo(todo));
        // Delete handler
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));
        todoListEl.appendChild(li);
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Create Todo
createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(createForm);
    const payload = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim()
    };
    try {
        const resp = await fetch(`${API}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error('Failed to create todo');
        createForm.reset();
        showMessage('Todo created successfully');
        loadTodos();
    } catch (err) {
        showMessage(err.message, true);
    }
});

// Delete Todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    try {
        const resp = await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error('Failed to delete todo');
        showMessage('Todo deleted');
        loadTodos();
    } catch (err) {
        showMessage(err.message, true);
    }
}

// Start Edit Flow
function startEditTodo(todo) {
    // Populate edit form
    document.getElementById('edit-id').value = todo.id;
    document.getElementById('edit-title').value = todo.title;
    document.getElementById('edit-description').value = todo.description;
    // Show edit section, hide create section
    editSection.classList.remove('hidden');
    // Optionally scroll to edit form
    editSection.scrollIntoView({ behavior: 'smooth' });
}

// Cancel Edit
cancelEditBtn.addEventListener('click', () => {
    editSection.classList.add('hidden');
    editForm.reset();
});

// Submit Edit
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const description = document.getElementById('edit-description').value.trim();
    const payload = { title, description };
    try {
        const resp = await fetch(`${API}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error('Failed to update todo');
        showMessage('Todo updated successfully');
        editSection.classList.add('hidden');
        editForm.reset();
        loadTodos();
    } catch (err) {
        showMessage(err.message, true);
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', loadTodos);
