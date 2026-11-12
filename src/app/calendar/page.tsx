
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

export default function CalendarPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 10, 1));

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studyflow-assignments");
      setAssignments(saved ? JSON.parse(saved) : []);
    } catch {
      setAssignments([]);
    }
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(year, month + offset, 1));
  };

  return (
    <main className="min-h-screen bg-violet-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-violet-700">
          📅 My Calendar
        </h1>
        <p className="mt-4 text-gray-600">
          Keep track of your deadlines and upcoming assignments.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="rounded-lg bg-violet-100 px-4 py-2 text-violet-700"
            >
              ← Previous
            </button>

            <h2 className="text-xl font-bold text-violet-700">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="rounded-lg bg-violet-100 px-4 py-2 text-violet-700"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day) => (
                <div
                  key={day}
                  className="py-2 text-center font-semibold text-violet-700"
                >
                  {day}
                </div>
              )
            )}

            {days.map((day, index) => {
              const dateString = day
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : "";

              const dayAssignments = assignments.filter(
                (assignment) => assignment.dueDate === dateString
              );

              return (
                <div
                  key={index}
                  className="min-h-28 rounded-lg border border-violet-100 bg-violet-50 p-2"
                >
                  {day && (
                    <>
                      <span className="font-semibold text-gray-700">
                        {day}
                      </span>

                      {dayAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="mt-2 rounded-md bg-violet-200 p-2 text-xs text-violet-900"
                          title={assignment.description}
                        >
                          <div className="font-semibold">
                            {assignment.title}
                          </div>
                          <div>{assignment.status}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
