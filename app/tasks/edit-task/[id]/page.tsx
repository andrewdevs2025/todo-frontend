"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import back from "@/public/arrow-left.svg";
import check from "@/public/check.svg";

const EditTaskPage = () => {
  const [task, setTask] = useState({ title: "", color: "red" });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId: string | string[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      const data = await res.json();
      setTask({ title: data.title, color: data.color || "red" });
    } catch (error) {
      console.error("Error fetching task", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!task.title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        router.push("/tasks"); // Redirect to Home View after updating the task
      }
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const colorOptions = [
    { name: "red", bgClass: "bg-[#FF3B30] " },
    { name: "orange", bgClass: "bg-[#FF9500] " },
    { name: "yellow", bgClass: "bg-[#FFCC00] " },
    { name: "green", bgClass: "bg-[#34C759] " },
    { name: "blue", bgClass: "bg-[#007AFF] " },
    { name: "indigo", bgClass: "bg-[#5856D6] " },
    { name: "purple", bgClass: "bg-[#AF52DE] " },
    { name: "pink", bgClass: "bg-[#FF2D55] " },
    { name: "brown", bgClass: "bg-[#A2845E] " },
  ];

  return (
    <div className="max-w-xl mx-auto py-8 px-4 bg-[#444444]">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-blue-500 mb-8 flex items-center"
      >
        <Image src={back} alt="back" width={24} height={24} className="mr-2" />
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-[#4EA8DE] mb-2">Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full h-[52px] bg-[#262626] p-4 border border-[#333333] text-[#F2F2F2] rounded-md"
              placeholder="Enter task title"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Color</label>
            <div className="flex justify-between">
              {colorOptions.map((option) => (
                <div
                  key={option.name}
                  onClick={() => setTask({ ...task, color: option.bgClass })}
                  className={`w-[52px] h-[52px] rounded-full cursor-pointer ${task.color === option.name ? "border-4 border-[#4EA8DE]" : ""
                    } ${option.bgClass}]`}
                ></div>
              ))}
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full h-[52px] flex justify-center items-center bg-[#1E6F9F] text-white mt-8 px-4 py-2 rounded-md"
          >
            Save
            <Image src={check} alt="plus" width={24} height={24} className="ml-2" />
          </button>
        </>
      )}
    </div>
  );
};

export default EditTaskPage;
