import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // Manage the confirmation state for deletion

  // Load todos from localStorage on initial load
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  // Save todos to localStorage whenever the todos array changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (id) => {
    const t = todos.find((i) => i.id === id);
    setTodo(t.todo);  // Set the todo value for editing
    handleDelete(id);  // Delete the task after editing
  };

  const handleDelete = (id) => {
    // If confirmation dialog is active, delete the task, otherwise ask for confirmation
    if (confirmDelete === id) {
      const newTodos = todos.filter((item) => item.id !== id);
      setTodos(newTodos);
      setConfirmDelete(null); // Reset confirmation state after deletion
    } else {
      setConfirmDelete(id); // Activate confirmation for this task
    }
  };

  const handleAdd = () => {
    if (todo.trim().length > 3) {
      const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
      setTodos(newTodos);
      setTodo(''); // Reset input after adding
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
    // Trigger the add task when the 'Enter' key is pressed
    if (e.key === 'Enter' && todo.trim().length > 3) {
      handleAdd();
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-slate-400 hover:bg-orange-200 transition-colors duration-300 min-h-[85vh] md:w-[60%]">
        <h1 className="flex items-center justify-center font-bold text-center text-3xl">
          <span className="hover:text-green-800 transition-colors duration-300">
            TaskHive - Stay on Track with Every Task
          </span>
        </h1>
        <div className="px-5 addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            <span className="hover:text-green-800 transition-colors duration-300">Add a Task</span>
          </h2>
          <div className="flex">
            <input
              onChange={handleChange}
              onKeyDown={handleKeyPress}  // Add the keydown event listener for "Enter"
              value={todo}
              type="text"
              className="w-full rounded-full px-5 border-10 py-1 border-lime-600 "
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>
        <input className="my-4" id="show" onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className="mx-2" htmlFor="show">
          Show Finished tasks
        </label>
        <div className="h-[2px] bg-black opacity-40 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No task pending</div>}
          {todos.map((item) =>
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className="flex gap-5">
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={item.isCompleted ? 'line-through' : ''}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <AiFillDelete />
                  </button>
                </div>
                {confirmDelete === item.id && (
                  <div className="confirm-delete">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white rounded-md p-1"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="bg-gray-600 text-white rounded-md p-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
