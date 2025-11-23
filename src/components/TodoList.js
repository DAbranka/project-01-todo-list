import { createElement } from "../functions/dom";

export class TodoList {

    #todos = []
    #list

    constructor(todos) {
        this.#todos = todos;
    }

    get todos() {
        return this.#todos
    }

    appendTo(element) {
        this.#list = document.querySelector('.todosList ul')
        this.#todos.forEach(e => {
            const todo = new TodoListItem(e)
            element.append(todo.element)
        });

        document.querySelector('.add-task-form').addEventListener('submit', (e) => {
            this.onSubmit(e)
        })
    }

    onSubmit(e) {
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(form)
            .get('todoTitle')
            .toString()
            .trim()
        if (title === '') {
            return
        }
        const newTodo = {
            id: Date.now(),
            title,
            completed: false
        }
        const todoItem = new TodoListItem(newTodo)

        this.#list.prepend(todoItem.element)
        console.log('Todos List', this.#list);
        form.reset()
    }
}

class TodoListItem {

    #element

    constructor(todo) {
        const id = `todo-${todo.id}`
        /* -------------------------------*/
        // * Li
        const li = createElement('li', {
            class: 'todo-li',
        })
        if (todo.completed) {
            li.classList.add('completed')
        }
        this.#element = li
        /* -------------------------------*/
        // * CHECKBOX
        const checkbox = createElement('input', {
            type: 'checkbox',
            id,
            checked: todo.completed ? '' : null
        })
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed')
            } else {
                li.classList.remove('completed')
            }
        })
        /* -------------------------------*/
        // * LABEL CONTAINER
        const labelContainer = createElement('div', {
            class: 'label-container'
        })
        const label = createElement('label', {
            for: id
        })
        label.innerText = todo.title

        labelContainer.append(label)

        /* -------------------------------*/
        // * DELETE Btn
        const button = createElement('button', {
            type: 'button',
        })
        button.innerHTML = 'delete'
        button
            .addEventListener('click', () => {
                this.remove(this.#element)
            })
        /* -------------------------------*/
        li.append(checkbox, labelContainer, button)
    }

    get element() {
        return this.#element
    }

    remove(element) {
        element.remove()
    }

    appendTo(element) {
        element.append(this.#element)
    }
}