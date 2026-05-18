import { useState, useEffect } from 'react'
import * as Sentry from '@sentry/react'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')

  const fetchTodos = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/todos/`)
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  

  const addTodo = async () => {
    if (!title.trim()) return
    await fetch(`${import.meta.env.VITE_API_URL}/api/todos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false })
    })
    setTitle('')
    fetchTodos()
  }

  const toggleTodo = async (todo) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    })
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/todos/${id}/`, {
      method: 'DELETE'
    })
    fetchTodos()
  }

  
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Ma TODO List</h1>
      <button onClick={() => Sentry.captureException(new Error('Test Sentry React!'))}>
        Test Sentry
      </button>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Nouvelle tâche..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo}>Ajouter</button>
      </div>
      {todos.map(todo => (
        <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo)} />
          <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  )
}

export default App