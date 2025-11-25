import { fetchJSON } from "./functions/api.js";
import { TodoList } from "./components/TodoList.js";
import { createElement } from "./functions/dom.js"

const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos/?_limit=5');
console.log(todos)

// * NEW LIST
const ul = document.querySelector('.todosList ul')
const list = new TodoList(todos)
list.appendTo(ul)
console.log(list.todos);
