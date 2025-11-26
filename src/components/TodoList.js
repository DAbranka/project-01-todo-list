import { createElement } from "../functions/dom";

export class TodoList {

    #todos = []
    #list
    #todosCount
    tasksRemaining
    tasksDone
    notCompletedTodos

    constructor(todos) {
        this.#todos = todos;
    }

    get todos() {
        return this.#todos
    }

    appendTo(element) {
        this.#list = element
        this.#todos.forEach(e => {
            const todo = new TodoListItem(e)
            this.#list.append(todo.element)
        });

        this.tasksRemaining = document.querySelector('.tasks-remaining')
        this.tasksDone = document.querySelector('.tasks-completed')
        this.#todosCount = this.#list.children.length
        this.notCompletedTodos = Array.from(this.#list.children).filter(li => !li.classList.contains('is-completed')).length
        // const notCompletedTodos = todosCount.length - Array.from(this.#list.children).filter(li => li.classList.contains('is-completed')).length
        const completedTodos = this.#todosCount - this.notCompletedTodos
        console.log('All Todos Amount', this.#todosCount);
        console.log('Not Completed Amount', this.notCompletedTodos);
        console.log('Completed Amount', completedTodos);
        this.tasksRemaining.innerText = `${this.notCompletedTodos} tasks remaining`
        this.tasksDone.innerText = `${completedTodos} tasks completed`

        document.querySelector('.add-task-form').addEventListener('submit', (e) => {
            this.onSubmit(e)
            this.updateTasksRemaining()
        })

        document.querySelectorAll('#todosFilters button')
            .forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    this.toggleFilter(e)
                })
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
        console.log('Todos List', ++this.#todosCount); // * => number of list items
        form.reset()
    }

    // set amountOfNotCompletedTasks(value) {
    //     this.notCompletedTodos = value
    // }

    updateTasksRemaining() {
        this.notCompletedTodos = Array.from(this.#list.children).filter(li => !li.classList.contains('is-completed')).length
        this.tasksRemaining.innerText = `${this.notCompletedTodos} tasks remaining`
    }

    toggleFilter(e) {
        const filter = e.currentTarget.getAttribute('data-filter')
        const activeBtn = e.currentTarget.parentElement.querySelector('.active')
        console.log(filter);

        if (activeBtn) {
            activeBtn.classList.remove('active')
        }
        e.currentTarget.classList.add('active')

        if (filter === 'todo') {
            this.#list.classList.add('hide-completed')
            this.#list.classList.remove('hide-todo')
        } else if (filter === 'done') {
            this.#list.classList.add('hide-todo')
            this.#list.classList.remove('hide-completed')
        } else {
            this.#list.classList.remove('hide-todo')
            this.#list.classList.remove('hide-completed')
        }
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
            li.classList.add('is-completed')
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
                li.classList.add('is-completed');
            } else {
                li.classList.remove('is-completed');
            }
            // Update tasks remaining in parent TodoList
            /* This code snippet is updating the number of tasks remaining in the parent TodoList when
            a checkbox in a TodoListItem is checked or unchecked. Here's a breakdown of what it
            does: */
            const todoListInstance = document.querySelector('.tasks-remaining');
            if (todoListInstance) {
                const list = li.parentElement;
                const notCompletedTodos = Array.from(list.children).filter(li => !li.classList.contains('is-completed')).length;
                todoListInstance.innerText = `${notCompletedTodos} tasks remaining`;
            }

            this.tasksDone = document.querySelector('.tasks-completed')
            if (this.tasksDone) {
                const list = li.parentElement;
                const completedTodos = Array.from(list.children).filter(li => li.classList.contains('is-completed')).length;
                this.tasksDone.innerText = `${completedTodos} tasks completed`;
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
        // * Date
        const dateSpan = createElement('span', {
            class: 'date-span'
        })
        const now = new Date()
        dateSpan.innerText = now.toLocaleString()
        labelContainer.append(dateSpan)

        /* -------------------------------*/
        // * DELETE Btn
        const button = createElement('button', {
            type: 'button',
        })
        button.innerHTML = 'delete'
        button
            .addEventListener('click', () => {
                const list = li.parentElement;
                this.remove(this.#element)

                const todoListInstance = document.querySelector('.tasks-remaining');
                if (todoListInstance) {
                    const notCompletedTodos = Array.from(list.children).filter(li => !li.classList.contains('is-completed')).length;
                    todoListInstance.innerText = `${notCompletedTodos} tasks remaining`;
                }

                this.tasksDone = document.querySelector('.tasks-completed')
                if (this.tasksDone) {
                    const completedTodos = Array.from(list.children).filter(li => li.classList.contains('is-completed')).length;
                    this.tasksDone.innerText = `${completedTodos} tasks completed`;
                }
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