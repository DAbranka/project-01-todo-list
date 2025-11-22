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
            element.append(todo)
        });
    }
}

class TodoListItem {

    #element

    constructor(todo) {
        const id = `todo-${todo.id}`
        const li = createElement('li', {
            class: 'todo-li',
        })
        this.#element = li
        const checkbox = createElement('input', {
            type: 'checkbox',
            id
        })
        const label = createElement('label', {
            for: '',
            id
        })
        const button = createElement('button', {
            type: 'button',
        })
        button.innerHTML = 'delete'
        label.innerText = todo.title
        li.append(checkbox, label, button)
        return li
    }

    appendTo (element) {
        element.append(this.#element)
    }
}