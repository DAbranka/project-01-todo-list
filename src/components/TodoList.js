import { createElement } from "../functions/dom";

export class TodoList {

    #todos = []

    constructor(todos) {
        this.#todos = todos;
    }

    get todos() {
        return this.#todos
    }

    appendTo(element) {
        this.#todos.forEach(e => {
            const todo = new TodoListItem(e)
            element.append(todo.element)
        });
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
        this.#element = li
        /* -------------------------------*/
        // * CHECKBOX
        const checkbox = createElement('input', {
            type: 'checkbox',
            id
        })
        /* -------------------------------*/
        // * LABEL
        const label = createElement('label', {
            for: '',
            id
        })
        label.innerText = todo.title
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
        li.append(checkbox, label, button)
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