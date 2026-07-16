"use client";

import React, { useState } from "react";

export function TaskList() {
  const [tasks, setTasks] = useState([
    { id: "1", text: "Revise React Hooks flashcards", done: false },
    { id: "2", text: "Upload Database Normalization assignments", done: true },
    { id: "3", text: "Conduct Frontend mock interview simulation", done: false },
    { id: "4", text: "Submit final project portfolio ZIP for review", done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {tasks.map((task) => (
        <label
          key={task.id}
          className={`flex items-center gap-3 p-3 rounded-xl border border-card-border hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer select-none text-xs font-semibold ${
            task.done ? "text-zinc-400 line-through" : "text-foreground"
          }`}
        >
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
            className="rounded border-card-border text-brand-primary focus:ring-brand-primary"
          />
          <span>{task.text}</span>
        </label>
      ))}
    </div>
  );
}
