
"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: string;
  name: string;
  color: string;
};

const colors = [
  { name: "Purple", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0].value);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await fetch("/api/subjects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load subjects");
        }

        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch {
        setError("Could not load subjects. Please try again.");
      } finally {
        setLoaded(true);
      }
    }

    loadSubjects();
  }, []);

  async function addSubject(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          color,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create subject");
      }

      const subject: Subject = await response.json();

      setSubjects((previous) => [...previous, subject]);
      setName("");
    } catch {
      setError("Could not create subject. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSubject(id: string) {
    if (!window.confirm("Delete this subject?")) return;

    setError("");

    try {
      const response = await fetch(
        `/api/subjects/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      setSubjects((previous) =>
        previous.filter((subject) => subject.id !== id)
      );
    } catch {
      setError("Could not delete subject. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-violet-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-violet-700">
          📚 My Subjects
        </h1>

        <p className="mt-4 text-gray-600">
          Organize and manage your academic subjects.
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
          onSubmit={addSubject}
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Add a New Subject
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subject name"
            maxLength={80}
            required
            className="mt-4 w-full rounded-xl border border-gray-300 p-3 text-gray-900"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                aria-label={option.name}
                aria-pressed={color === option.value}
                className={`h-9 w-9 rounded-full ${
                  color === option.value
                    ? "ring-2 ring-violet-700 ring-offset-2"
                    : ""
                }`}
                style={{ backgroundColor: option.value }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "+ Add Subject"}
          </button>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="font-semibold text-gray-900">
                  {subject.name}
                </span>
              </div>

              <button
                onClick={() => deleteSubject(subject.id)}
                className="rounded-lg px-3 py-2 text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {loaded && subjects.length === 0 && !error && (
          <p className="mt-8 text-center text-gray-500">
            No subjects yet. Add your first subject above!
          </p>
        )}
      </div>
    </main>
  );
}
