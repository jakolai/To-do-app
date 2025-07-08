import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  const handleInput = (e) => setInput(e.target.value);

  const toggleDone = idx => {
    setTasks(tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  };

  const handleEdit = (idx) => {
    // Placeholder: implement edit logic here
    alert('Edit button clicked for item ' + idx);
  };

  const handleRemove = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  return (
    <div className='center-container'>
      <div className='button1'>
        <div className='square-title'>To-do</div>
        <div className='input-container'>
          <input
            type='text'
            value={input}
            onChange={handleInput}
            placeholder='Add a new task...'
            className='todo-input'
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
        <ul className='todo-list'>
          {tasks.length === 0 ? (
            <li className='empty-message'>Empty list. Add a task.</li>
          ) : (
            tasks.map((task, idx) => (
              <li key={idx} className='todo-item'>
                <span style={{ textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#aaa' : '#222' }}>{task.text}</span>
                <div className='todo-actions'>
                  <button className='icon-btn finish-btn' onClick={() => toggleDone(idx)} title='Done' disabled={task.done}>✔️</button>
                  <button className='icon-btn edit-btn' onClick={() => handleEdit(idx)} title='Edit'>✏️</button>
                  <button className='icon-btn remove-btn' onClick={() => handleRemove(idx)} title='Remove'>🗑️</button>
                </div>
              </li>
            ))
          )}
        </ul>
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}

export default App

