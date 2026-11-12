
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
  description: string | null;
  subjectId: string | null;
  dueDate: string | null;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
};

export default function AssignmentsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<Assignment["priority"]>("Medium");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const [subjectsResponse, assignmentsResponse] =
          await Promise.all([
            fetch("/api/subjects", { cache: "no-store" }),
            fetch("/api/assignments", { cache: "no-store" }),
          ]);

        if (!subjectsResponse.ok || !assignmentsResponse.ok) {
          throw new Error("Failed to load data");
        }

        setSubjects(await subjectsResponse.json());
        setAssignments(await assignmentsResponse.json());
      } catch {
        setError("Could not load data. Please refresh the page.");
      } finally {
        setLoaded(true);
      }
    }

    loadData();
  }, []);

  async function addAssignment(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim() || !dueDate || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          subjectId,
          dueDate,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      const assignment: Assignment = await response.json();

      setAssignments((current) => [...current, assignment]);
      setTitle("");
      setDescription("");
      setSubjectId("");
      setDueDate("");
      setPriority("Medium");
    } catch {
      setError("Could not create assignment. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    id: string,
    status: Assignment["status"]
  ) {
    setError("");

    try {
      const response = await fetch(
        `/api/assignments/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updated: Assignment = await response.json();

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === id ? updated : assignment
        )
      );
    } catch {
      setError("Could not update assignment status.");
    }
  }

  async function deleteAssignment(id: string) {
    if (!window.confirm("Delete this assignment?")) return;

    setError("");

    try {
      const response = await fetch(
        `/api/assignments/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }

      setAssignments((current) =>
        current.filter((assignment) => assignment.id !== id)
      );
    } catch {
      setError("Could not delete assignment.");
    }
  }

  const visibleAssignments = assignments
    .filter(
      (assignment) =>
        filter === "All" || assignment.status === filter
    )
    .sort((a, b) =>
      (a.dueDate || "").localeCompare(b.dueDate || "")
    );

  return (
    <main className="min-h-screen bg-violet-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-violet-700">
          📝 My Assignments
        </h1>

        <p className="mt-4 text-gray-600">
          Organize your assignments and never miss a deadline.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

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
                setPriority(
                  e.target.value as Assignment["priority"]
                )
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
            disabled={saving}
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "+ Add Assignment"}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", "Pending", "In Progress", "Completed"].map(
            (option) => (
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
            )
          )}
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
                      📅{" "}
                      {assignment.dueDate
                        ? assignment.dueDate.slice(0, 10)
                        : "No deadline"}{" "}
                      | Priority: {assignment.priority}
                    </p>

                    {subject && (
                      <p
                        className="mt-2 text-sm"
                        style={{ color: subject.color }}
                      >
                        ● {subject.name}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      deleteAssignment(assignment.id)
                    }
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

        {loaded && visibleAssignments.length === 0 && !error && (
          <p className="mt-8 text-center text-gray-500">
            No assignments to display.
          </p>
        )}
      </div>
    </main>
  );
}
