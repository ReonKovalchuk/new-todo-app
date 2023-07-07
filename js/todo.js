
async function loadTodoItemsFromServer() {
    const response = await fetch('http://localhost:3000/api/todos');
    const data = await response.json();
    return data;
}

async function createTodoItemOnServer(item) {
    const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: item.name,
            owner: OWNER,
        })
    });
    const data = await response.json();
    return data;
}

async function getTodoItemFromServer(id) {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`);
    const data = await response.json();
    return data;
}

async function changeTodoStatusOnServer(id, status) {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: status })
    });
    const data = await response.json();
    return data;
}

async function deleteTodoItemFromServer(id) {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
    });
    if (response.status === 404)
        return false;
    const data = await response.json();
    return true;
}

/////////////////////////////////////////////////////////////////

function createNewTaskForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Новое дело';
    button.classList.add('btn', 'btn-outline-dark', 'mb-0');
    button.textContent = 'Добавить дело';
    button.type = 'submit';

    form.append(input);
    form.append(button);

    return {
        form,
        input,
        button,
    }
}

async function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    let savedTasks = await loadTodoItemsFromServer();
    savedTasks.forEach(task => {
        let taskElement = createTaskElement(task);
        list.append(taskElement);
    });
    return list;
}

function createTaskElement(task) {

    let item = document.createElement('li');
    let checkInput = document.createElement('input');
    let deleteBtn = document.createElement('button');
    let label = document.createElement('label')

    item.classList.add('list-group-item', 'list-item');
    item.innerHTML = '<i class="bi bi-list me-3"></i>';
    label.classList.add('form-check-label');
    label.textContent = task.name;

    checkInput.classList.add('form-check-input', 'me-2');
    checkInput.type = 'checkbox';
    checkInput.setAttribute('id', task.id);
    checkInput.checked = task.done;
    if (task.done) {
        item.classList.add('task-done');
    }
    checkInput.addEventListener('click', function () {
        this.parentElement.classList.toggle('task-done');
        let done = checkInput.checked;
        changeTodoStatusOnServer(checkInput.getAttribute('id'), done)
    })

    deleteBtn.type = 'button';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
    deleteBtn.setAttribute('aria-label', 'Удалить дело')
    deleteBtn.addEventListener('click', function () {
        if (confirm('Удалить элемент из списка?')) {

            deleteTodoItemFromServer(checkInput.getAttribute('id'))
            item.remove();

        }
    });
    label.insertAdjacentElement('afterbegin', checkInput);
    item.append(label);

    item.append(deleteBtn);


    return item;

}
{/* <ul class="list-group">
            <li class="list-group-item list-item">
              <label class="form-check-label">
                <input class="form-check-input me-2" type="checkbox">
                sass
              </label>
              <button type="button" class="delete-btn" aria-label="Удалить дело"><i class="bi bi-trash-fill"></i></button>
              
            </li>
            

          </ul> */}


async function createTodoApp(containerClass = '.todo-app',) {
    let container = document.querySelector(containerClass);
    let newTaskForm = createNewTaskForm();
    let todoList = await createTodoList();
    container.append(newTaskForm.form);
    container.append(todoList);

    newTaskForm.form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!newTaskForm.input.value) { return };

        let taskObj = { name: newTaskForm.input.value, done: false }
        let newTask = await createTodoItemOnServer(taskObj);

        let taskElement = createTaskElement(newTask);


        todoList.append(taskElement);
        newTaskForm.input.value = '';
    });
    new Sortable(document.querySelector('.list-group'), {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
}


document.addEventListener('DOMContentLoaded', function () {

    createTodoApp();

});
