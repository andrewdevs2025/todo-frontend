"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import check from "@/public/check.svg";
import plus from "@/public/plus.svg";
import trash from "@/public/trash.svg";
import clipboard from "@/public/clipboard.svg";

interface Task {
  id: number;
  title: string;
  color: string | null;
  completed: boolean;
}

const HomeView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
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
    }
  };

  const handleEditTask = (taskId: number) => {
    router.push(`/tasks/edit-task/${taskId}`);
  };

  return (
    <div className="max-w-xl mx-auto px-6 bg-none">
      {/* Full width Create Task Button */}
      <div className="-mt-[26px] mb-6">
        <button
          onClick={() => router.push("/tasks/create-task")}
          className="flex justify-center items-center w-full h-[52px] bg-[#1E6F9F] text-white py-2 rounded-md font-semibold"
        >
          Create Task
          <Image src={plus} alt="plus" width={24} height={24} className="ml-2" />
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <p>
          <span className="text-[#4EA8DE]">Tasks</span>:{" "}
          <span className="bg-[#333333] text-[#D9D9D9] text-xs py-1 px-2 rounded-full">
            {tasks.length}
          </span>
        </p>
        <p>
          <span className="text-[#8284FA]">Completed:</span>{" "}
          <span className="bg-[#333333] text-[#D9D9D9] text-xs py-1 px-2 rounded-full">
            {tasks.filter((task) => task.completed).length} of {tasks.length}
          </span>
        </p>
      </div>

      {loading ? (
        <p className="text-center">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-[#808080]">
          <Image src={clipboard} alt="plus" width={56} height={56} />
          <p className="mt-2 mb-4"><strong>You don't have any tasks registered yet.</strong></p>
          <p><span>Create tasks and organize your to-do items.</span></p>
        </div>
      ) : (
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between mb-4 p-4 border border-[#333333] rounded-md bg-[#262626]`}
          >
            <div className="flex items-center">
              {/* Custom Circle Checkbox */}
              <label className="relative mr-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <span
                  className={`flex justify-center items-center w-6 h-6 border-2 rounded-full ${task.completed ? "bg-[#8284FA] border-[#8284FA]" : "bg-none border-[#4EA8DE]"} transition-all`}
                >
                  {task.completed && <Image src={check} alt="check" width={12} height={12} />}
                </span>
              </label>
              <span
                className={`${task.completed ? "line-through text-[#808080]" : "text-[#F2F2F2]"}`}
                onClick={() => handleEditTask(task.id)}
              >
                {task.title}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="p-2 rounded-md"
            >
              <Image src={trash} alt="delete" width={24} height={24} />
            </button>
          </li> 
        ))} 
      </ul>
      )} 
    </div>
  ); 
};

export default HomeView;
