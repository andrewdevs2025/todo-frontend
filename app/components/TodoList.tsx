"user client";

import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  color: string | null;
  completed: boolean;
}

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask,
        }),
      });

      if (res.ok) {
        setNewTask("");
        fetchTasks(); // Refresh the task list
      } else {
        console.error("Error creating task");
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !completed,
        }),
      });

      if (res.ok) {
        fetchTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-4">Todo List</h1>

      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter new task"
        />
        <button
          onClick={handleCreateTask}
          className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between mb-4 p-4 border rounded-md ${
                task.completed ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    handleToggleTask(task.id, task.completed)
                  }
                  className="mr-4"
                />
                <span
                  className={`${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
