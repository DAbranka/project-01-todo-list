import { fetchJSON } from "./functions/api.js";
import { TodoList } from "./components/TodoList.js";
import {createElement} from "./functions/dom.js"

const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos/?_limit=5');
console.log(todos)

const ul = document.querySelector('.todosList ul')
console.log(ul);

todos.forEach((e) => {
  const li = createElement('li', {
    class: 'todo-title'
  })
  li.innerText = e.title
  ul.append(li)
})