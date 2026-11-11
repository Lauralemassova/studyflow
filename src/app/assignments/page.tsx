
"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: string;
  name: string;
  color: string;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
};

export default function AssignmentsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Assignment["priority"]>("Medium");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      setSubjects(
        JSON.parse(localStorage.getItem("studyflow-subjects") || "[]")
      );
      setAssignments(
        JSON.parse(localStorage.getItem("studyflow-assignments") || "[]")
      );
    } catch {
      console.error("Could not load saved data");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "studyflow-assignments",
        JSON.stringify(assignments)
      );
    }
  }, [assignments, loaded]);

  function addAssignment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    setAssignments([
      ...assignments,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        subjectId,
        dueDate,
        priority,
        status: "Pending",
      },
    ]);

    setTitle("");
    setDescription("");
    setSubjectId("");
    setDueDate("");
    setPriority("Medium");
  }

  function changeStatus(id: string, status: Assignment["status"]) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === id ? { ...assignment, status } : assignment
      )
    );
  }

  function deleteAssignment(id: string) {
    setAssignments((current) =>
      current.filter((assignment) => assignment.id !== id)
    );
  }

  const visibleAssignments = assignments
    .filter((assignment) => filter === "All" || assignment.status === filter)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <main className="min-h-screen bg-violet-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-violet-700">
          📝 My Assignments
        </h1>
        <p className="mt-4 text-gray-600">
          Organize your assignments and never miss a deadline.
        </p>

        <form
          onSubmit={addAssignment}
          className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Add a New Assignment
          </h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment title"
            required
            className="w-full rounded-xl border border-gray-300 p-3 text-gray-900"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-xl border border-gray-300 p-3 text-gray-900"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="rounded-xl border border-gray-300 p-3 text-gray-900"
            >
              <option value="">No subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="rounded-xl border border-gray-300 p-3 text-gray-900"
            />

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as Assignment["priority"])
              }
              className="rounded-xl border border-gray-300 p-3 text-gray-900"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            + Add Assignment
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", "Pending", "In Progress", "Completed"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`rounded-xl px-4 py-2 ${
                filter === option
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {visibleAssignments.map((assignment) => {
            const subject = subjects.find(
              (item) => item.id === assignment.subjectId
            );

            return (
              <div
                key={assignment.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
                    {assignment.description && (
                      <p className="mt-2 text-gray-600">
                        {assignment.description}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-gray-600">
                      📅 {assignment.dueDate} | Priority: {assignment.priority}
                    </p>
                    {subject && (
                      <p className="mt-2 text-sm" style={{ color: subject.color }}>
                        ● {subject.name}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteAssignment(assignment.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>

                <select
                  value={assignment.status}
                  onChange={(e) =>
                    changeStatus(
                      assignment.id,
                      e.target.value as Assignment["status"]
                    )
                  }
                  className="mt-4 rounded-xl border border-gray-300 p-2 text-gray-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            );
          })}
        </div>

        {loaded && visibleAssignments.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            No assignments to display.
          </p>
        )}
      </div>
    </main>
  );
}
