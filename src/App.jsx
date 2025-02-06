import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [showFinished, setShowFinished] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)); // ✅ Always save, even when empty
  }, [todos]);

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (id) => {
    const taskToEdit = todos.find((t) => t.id === id);
    if (taskToEdit) {
      setTodo(taskToEdit.todo);
      handleDelete(id);
    }
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      const newTodos = todos.filter((task) => task.id !== id);
      setTodos(newTodos);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const handleAdd = () => {
    if (todo.trim().length > 3) {
      const newTask = { id: uuidv4(), todo, isCompleted: false };
      setTodos([...todos, newTask]);
      setTodo('');
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
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

        {/* Add Task Section */}
        <div className="px-5 addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            <span className="hover:text-green-800 transition-colors duration-300">Add a Task</span>
          </h2>
          <div className="flex">
            <input
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              value={todo}
              type="text"
              placeholder="Enter your task..."
              className="w-full rounded-full px-5 border-2 py-1 border-lime-600"
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

        {/* Show Finished Checkbox */}
        <div className="flex items-center">
          <input className="my-4" id="show" onChange={toggleFinished} type="checkbox" checked={showFinished} />
          <label className="mx-2 text-lg" htmlFor="show">
            Show Finished tasks
          </label>
        </div>

        <div className="h-[2px] bg-black opacity-40 w-[90%] mx-auto my-2"></div>

        {/* Task List */}
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5 text-gray-700">No tasks pending</div>}
          {todos.map((task) =>
            (showFinished || !task.isCompleted) && (
              <div key={task.id} className="todo flex my-3 justify-between items-center bg-white p-3 rounded-md shadow-md">
                <div className="flex gap-5 items-center">
                  <input
                    name={task.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={task.isCompleted}
                  />
                  <div className={task.isCompleted ? 'line-through text-gray-500' : ''}>{task.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="bg-blue-600 hover:bg-blue-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 hover:bg-red-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <AiFillDelete />
                  </button>
                </div>
                {confirmDelete === task.id && (
                  <div className="confirm-delete flex gap-2">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="bg-red-600 text-white rounded-md px-2 py-1"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="bg-gray-600 text-white rounded-md px-2 py-1"
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
