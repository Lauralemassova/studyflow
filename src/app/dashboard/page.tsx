
"use client";

import { useEffect, useState } from "react";

type Assignment = {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
};

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);


  useEffect(() => {
    async function loadAssignments() {
      try {
        const response = await fetch("/api/assignments", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load assignments");
        }

        const data: Assignment[] = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      }
    }

    loadAssignments();
  }, []);


  const completed = assignments.filter(
    (item) => item.status === "Completed"
  ).length;

  const inProgress = assignments.filter(
    (item) => item.status === "In Progress"
  ).length;

  const pending = assignments.filter(
    (item) => item.status === "Pending"
  ).length;

  const upcoming = assignments
    .filter(
      (item) =>
        item.dueDate &&
        item.status !== "Completed" &&
        item.dueDate >= new Date().toLocaleDateString("en-CA")
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const stats = [
    { label: "Total Assignments", value: assignments.length, icon: "📝" },
    { label: "Completed", value: completed, icon: "✅" },
    { label: "In Progress", value: inProgress, icon: "🚀" },
    { label: "Pending", value: pending, icon: "⏳" },
  ];

  return (
    <main className="min-h-screen bg-violet-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-violet-700">
          📊 My Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          Track your academic progress and upcoming deadlines.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="text-3xl">{stat.icon}</div>
              <p className="mt-4 text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-4xl font-bold text-violet-700">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-violet-700">
            📅 Upcoming Deadlines
          </h2>

          {upcoming.length === 0 ? (
            <p className="mt-5 text-gray-500">
              No upcoming deadlines. You're all caught up! 🎉
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {upcoming.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-violet-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.status} | {item.priority} Priority
                    </p>
                  </div>
                  <span className="font-medium text-violet-700">
                    {item.dueDate}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <a
          href="/assignments"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          Manage Assignments →
        </a>
      </div>
    </main>
  );
}
