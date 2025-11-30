import { createElement } from "../functions/dom";

export class TodoList {

    #todos = []
    #list
    #tasksRemaining
    #tasksDone

    constructor(todos) {
        this.#todos = todos || [];
    }

    get todos() {
        return this.#todos
    }

    appendTo(element) {
        this.#list = element
        
        // Initialiser les références aux éléments DOM
        this.#tasksRemaining = document.querySelector('.tasks-remaining')
        this.#tasksDone = document.querySelector('.tasks-completed')

        // Créer les éléments de todo existants
        this.#todos.forEach(todo => {
            const todoItem = new TodoListItem(todo, this)
            this.#list.append(todoItem.element)
        });

        // Mettre à jour les compteurs
        this.#updateCounters()

        // Ajouter les event listeners
        this.#setupEventListeners()
    }

    #setupEventListeners() {
        const form = document.querySelector('.add-task-form')
        if (form) {
            form.addEventListener('submit', (e) => {
                this.#handleSubmit(e)
            })
        }

        document.querySelectorAll('#todosFilters button')
            .forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    this.#handleFilterToggle(e)
                })
            })
    }

    #handleSubmit(e) {
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(form)
            .get('todoTitle')
            ?.toString()
            .trim()
        
        if (!title) {
            return
        }

        const newTodo = {
            id: Date.now(),
            title,
            completed: false
        }

        // Ajouter au tableau
        this.#todos.unshift(newTodo)

        // Créer et ajouter l'élément DOM
        const todoItem = new TodoListItem(newTodo, this)
        this.#list.prepend(todoItem.element)
        form.reset()

        // Appliquer l'animation fadeIn
        setTimeout(() => {
            todoItem.element.classList.add('fade-in')
        }, 10)

        // Mettre à jour les compteurs
        this.#updateCounters()
    }

    removeTodo(todoId) {
        // Retirer du tableau
        this.#todos = this.#todos.filter(todo => todo.id !== todoId)
        // Mettre à jour les compteurs
        this.#updateCounters()
    }

    updateTodoStatus(todoId, completed) {
        const todo = this.#todos.find(t => t.id === todoId)
        if (todo) {
            todo.completed = completed
            this.#updateCounters()
        }
    }

    #updateCounters() {
        if (!this.#tasksRemaining || !this.#tasksDone) {
            return
        }

        const notCompletedCount = this.#todos.filter(todo => !todo.completed).length
        const completedCount = this.#todos.length - notCompletedCount

        this.#tasksRemaining.innerText = `${notCompletedCount} tasks remaining`
        this.#tasksDone.innerText = `${completedCount} tasks completed`
    }

    #handleFilterToggle(e) {
        const filter = e.currentTarget.getAttribute('data-filter')
        const activeBtn = e.currentTarget.parentElement.querySelector('.active')

        if (activeBtn) {
            activeBtn.classList.remove('active')
        }
        e.currentTarget.classList.add('active')

        // Appliquer les classes de filtrage
        this.#list.classList.remove('hide-todo', 'hide-completed')
        
        if (filter === 'todo') {
            this.#list.classList.add('hide-completed')
        } else if (filter === 'done') {
            this.#list.classList.add('hide-todo')
        }

        // Retirer toutes les classes fade-in existantes
        Array.from(this.#list.children).forEach(item => {
            item.classList.remove('fade-in')
        })

        // Ajouter l'animation fadeIn aux éléments visibles
        setTimeout(() => {
            const visibleItems = Array.from(this.#list.children).filter(li => {
                if (filter === 'todo') {
                    return !li.classList.contains('is-completed')
                } else if (filter === 'done') {
                    return li.classList.contains('is-completed')
                }
                return true
            })

            visibleItems.forEach(item => {
                item.classList.add('fade-in')
            })
        }, 10)
    }
}

class TodoListItem {

    #element
    #todo
    #todoList

    constructor(todo, todoList) {
        this.#todo = todo
        this.#todoList = todoList
        const id = `todo-${todo.id}`
        
        // Créer l'élément li
        const li = createElement('li', {
            class: 'todo-li',
        })
        if (todo.completed) {
            li.classList.add('is-completed')
        }
        this.#element = li
        
        // Créer la checkbox
        const checkbox = createElement('input', {
            type: 'checkbox',
            id,
            checked: todo.completed ? '' : null
        })
        checkbox.addEventListener('change', () => {
            this.#handleCheckboxChange(checkbox)
        })
        
        // Créer le conteneur du label
        const labelContainer = createElement('div', {
            class: 'label-container'
        })
        const label = createElement('label', {
            for: id
        })
        label.innerText = todo.title
        labelContainer.append(label)
        
        // Créer l'affichage de la date
        const dateSpan = createElement('span', {
            class: 'date-span'
        })
        const now = new Date()
        dateSpan.innerText = now.toLocaleString()
        labelContainer.append(dateSpan)

        // Créer le bouton de suppression
        const button = createElement('button', {
            type: 'button',
        })
        button.innerHTML = 'delete'
        button.addEventListener('click', () => {
            this.#handleDelete()
        })
        
        li.append(checkbox, labelContainer, button)
    }

    #handleCheckboxChange(checkbox) {
        const isCompleted = checkbox.checked
        if (isCompleted) {
            this.#element.classList.add('is-completed')
        } else {
            this.#element.classList.remove('is-completed')
        }
        
        // Mettre à jour le statut dans le parent TodoList
        this.#todoList.updateTodoStatus(this.#todo.id, isCompleted)
    }

    #handleDelete() {
        // Appliquer l'animation fadeOut
        this.#element.classList.add('fade-out')
        
        // Attendre la fin de l'animation avant de supprimer
        setTimeout(() => {
            this.#element.remove()
            // Notifier le parent TodoList de la suppression
            this.#todoList.removeTodo(this.#todo.id)
        }, 400) // Durée de l'animation fadeOut (0.4s)
    }

    get element() {
        return this.#element
    }
}