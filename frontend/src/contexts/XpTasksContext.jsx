import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Task shape used across the dashboard
// {
//   id: string,
//   title: string,
//   xp: number,
//   completed: boolean,
//   xpAwarded: boolean,
//   completedAt: string | null // ISO timestamp
// }

const STORAGE_KEY = "xpTasks";

const XpTasksContext = createContext(null);

const getTodayKey = () => new Date().toISOString().split("T")[0];

const clampXP = (xp, min = 2, max = 5) => {
  const value = typeof xp === "number" ? xp : Number(xp);
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const normalizeTasks = (raw) => {
  if (!Array.isArray(raw)) return [];

  return raw.map((task, index) => {
    const id = String(task.id ?? `task-${index}-${Date.now()}`);
    const title = task.title ?? task.text ?? task.name ?? "Untitled Task";
    const xp = clampXP(task.xp ?? 2);
    const completed = Boolean(task.completed);
    const xpAwarded = Boolean(task.xpAwarded) || (completed && Boolean(task.completedAt));

    let completedAt = task.completedAt ?? null;
    if (xpAwarded && !completedAt) {
      completedAt = new Date().toISOString();
    }

    return {
      id,
      title,
      xp,
      completed,
      xpAwarded,
      completedAt,
    };
  });
};

const getDefaultTasks = () => {
  const todayIso = new Date().toISOString();

  return [
    {
      id: "todo-1",
      title: "Plan today's tasks",
      xp: 5,
      completed: false,
      xpAwarded: false,
      completedAt: null,
    },
    {
      id: "todo-2",
      title: "Review meeting notes",
      xp: 5,
      completed: true,
      xpAwarded: true,
      completedAt: todayIso,
    },
    {
      id: "todo-3",
      title: "Schedule a call",
      xp: 5,
      completed: false,
      xpAwarded: false,
      completedAt: null,
    },
  ];
};

export const XpTasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return normalizeTasks(JSON.parse(stored));
      }
      return getDefaultTasks();
    } catch (error) {
      console.error("Failed to load XP tasks from storage", error);
      return getDefaultTasks();
    }
  });

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save XP tasks to storage", error);
    }
  }, [tasks]);

  const totalXP = useMemo(
    () => tasks.reduce((sum, task) => (task.xpAwarded ? sum + task.xp : sum), 0),
    [tasks]
  );

  const todayXP = useMemo(() => {
    const today = getTodayKey();
    return tasks.reduce((sum, task) => {
      if (!task.xpAwarded || !task.completedAt) return sum;
      return task.completedAt.startsWith(today) ? sum + task.xp : sum;
    }, 0);
  }, [tasks]);

  const level = useMemo(() => Math.floor(totalXP / 100) + 1, [totalXP]);

  const addTask = (title, xp = 2) => {
    const trimmed = (title || "").trim();
    if (!trimmed) return;

    const safeXP = clampXP(xp);

    setTasks((prev) => [
      ...prev,
      {
        id: `todo-${Date.now()}`,
        title: trimmed,
        xp: safeXP,
        completed: false,
        xpAwarded: false,
        completedAt: null,
      },
    ]);
  };

  const toggleTaskCompletion = (id) => {
    const nowIso = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const togglingToCompleted = !task.completed;

        if (togglingToCompleted && !task.xpAwarded) {
          return {
            ...task,
            completed: true,
            xpAwarded: true,
            completedAt: nowIso,
          };
        }

        return {
          ...task,
          completed: togglingToCompleted,
        };
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const value = {
    tasks,
    setTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    totalXP,
    todayXP,
    level,
  };

  return <XpTasksContext.Provider value={value}>{children}</XpTasksContext.Provider>;
};

export const useXpTasks = () => {
  const ctx = useContext(XpTasksContext);
  if (!ctx) {
    throw new Error("useXpTasks must be used within an XpTasksProvider");
  }
  return ctx;
};
