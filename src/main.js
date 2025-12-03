import { fetchJSON } from "./functions/api.js";
import { TodoList } from "./components/TodoList.js";

/**
 * Valide la structure d'un todo
 * @param {any} todo - Objet todo à valider
 * @returns {boolean}
 */
function isValidTodo(todo) {
    return (
        todo &&
        typeof todo === 'object' &&
        typeof todo.id === 'number' &&
        typeof todo.title === 'string' &&
        typeof todo.completed === 'boolean' &&
        todo.title.length > 0 &&
        todo.title.length <= 500
    )
}

/**
 * Valide et filtre les todos de l'API
 * @param {any} data - Données reçues de l'API
 * @returns {Array} - Tableau de todos valides
 */
function validateTodos(data) {
    if (!Array.isArray(data)) {
        console.warn('Les données de l\'API ne sont pas un tableau')
        return []
    }
    
    return data.filter(todo => {
        if (!isValidTodo(todo)) {
            console.warn('Todo invalide ignoré:', todo)
            return false
        }
        return true
    })
}

try {
    const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos/?_limit=5')
    const validTodos = validateTodos(todos)
    
    console.log(`${validTodos.length} todos valides chargés sur ${todos.length}`)

    // * NEW LIST
    const ul = document.querySelector('.todosList ul')
    if (!ul) {
        throw new Error('Élément .todosList ul introuvable dans le DOM')
    }
    
    const list = new TodoList(validTodos)
    list.appendTo(ul)
} catch (error) {
    console.error('Erreur lors du chargement des todos:', error)
    // Afficher un message d'erreur à l'utilisateur
    const ul = document.querySelector('.todosList ul')
    if (ul) {
        const errorLi = document.createElement('li')
        errorLi.style.color = 'var(--accent)'
        errorLi.style.padding = '1rem'
        errorLi.textContent = 'Erreur lors du chargement des tâches. Veuillez rafraîchir la page.'
        ul.appendChild(errorLi)
    }
}