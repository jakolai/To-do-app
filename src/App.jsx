import { useState, useEffect } from 'react'
import { set, get } from 'idb-keyval'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faTrashCan,
  faSave,
  faCancel
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Load tasks from IndexedDB on mount
  useEffect(() => {
    async function loadTasks() {
      const stored = await get('tasks');
      if (stored) setTasks(stored);
      setInitialized(true);
    }
    loadTasks();
  }, []);

  // Save tasks to IndexedDB only after initial load
  useEffect(() => {
    if (initialized) {
      set('tasks', tasks);
    }
  }, [tasks, initialized]);

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
    setEditIdx(idx);
    setEditValue(tasks[idx].text);
  };

  const handleEditChange = (e) => setEditValue(e.target.value);

  const handleEditSave = (idx) => {
    if (editValue.trim() === "") return;
    setTasks(tasks.map((t, i) => i === idx ? { ...t, text: editValue } : t));
    setEditIdx(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditValue("");
  };

  const handleRemove = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  return (
    <div className='center-container'>
      <div className='panel'>
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
            <li className='empty-message'>Empty list. Add a task.</li>) : (
            tasks.map((task, idx) => (
              <li key={idx} className='todo-item'>
                {editIdx === idx ? (
                  <>
                    <input
                      className='edit-input'
                      value={editValue}
                      onChange={handleEditChange}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleEditSave(idx);
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      autoFocus
                    />
                    <button className='todo-button icon-btn save-btn' onClick={() => handleEditSave(idx)} title='Save'><FontAwesomeIcon icon={faSave} /></button>
                    <button className='todo-button icon-btn cancel-btn' onClick={handleEditCancel} title='Cancel'><FontAwesomeIcon icon={faCancel} /></button>
                  </>
                ) : (
                  <>
                    <span style={{ textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#aaa' : '#222' }}>{task.text}</span>
                    <div className='todo-actions'>
                      <button className='todo-button icon-btn finish-btn' onClick={() => toggleDone(idx)} title='Done' disabled={task.done}><FontAwesomeIcon icon={faCheck} /></button>
                      <button className='todo-button icon-btn edit-btn' onClick={() => handleEdit(idx)} title='Edit'><FontAwesomeIcon icon={faEdit} /></button>
                      <button className='todo-button icon-btn remove-btn' onClick={() => handleRemove(idx)} title='Remove'><FontAwesomeIcon icon={faTrashCan} /></button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
        <button className='button1' onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}

export default App

