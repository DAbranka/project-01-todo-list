import { createElement } from "../functions/dom";

export class TodoList {

    #todos

    constructor(todos) {
        this.#todos = todos;
    }

    get todos() {
        return this.#todos
    }

    appendTo(element) {
        this.#todos.forEach(e => {
            const li = createElement('li', {
                class: 'todo-title',
            })
            li.innerText = e.title
            element.append(li)
        });
    }
}