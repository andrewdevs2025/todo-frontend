"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import back from "@/public/arrow-left.svg";
import plus from "@/public/plus.svg";

const CreateTaskPage = () => {
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>("red");
  const router = useRouter();

  const colors = [
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

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    const newTask = { title, color };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        router.push("/tasks"); // Redirect to Home View after creating the task
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 bg-[#444444]">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-blue-500 mb-8 flex items-center"
      >
        <Image src={back} alt="back" width={24} height={24} className="mr-2" />
      </button>

      <div className="mb-4">
        <label className="block text-[#4EA8DE] mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-[52px] bg-[#262626] p-4 border border-[#333333] text-[#F2F2F2] rounded-md"
          placeholder="Ex. Brush you teeth"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Color</label>
        <div className="flex justify-between">
          {colors.map(({ name, bgClass }) => (
            <div
              key={name}
              onClick={() => setColor(name)}
              className={`w-[52px] h-[52px] rounded-full cursor-pointer ${bgClass} ${color === name ? "ring-4 ring-blue-400" : ""
                }`}
            ></div>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="w-full h-[52px] flex justify-center items-center bg-[#1E6F9F] text-white mt-8 px-4 py-2 rounded-md"
      >
        Add Task
        <Image src={plus} alt="plus" width={24} height={24} className="ml-2" />
      </button>
    </div>
  );
};

export default CreateTaskPage;
