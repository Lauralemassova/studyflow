
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studyflow-subjects");
      if (saved) setSubjects(JSON.parse(saved));
    } catch {
      console.error("Could not load subjects");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "studyflow-subjects",
        JSON.stringify(subjects)
      );
    }
  }, [subjects, loaded]);

  function addSubject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    setSubjects([
      ...subjects,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
      },
    ]);

    setName("");
  }

  function deleteSubject(id: string) {
    setSubjects(subjects.filter((subject) => subject.id !== id));
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
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            + Add Subject
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

        {loaded && subjects.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            No subjects yet. Add your first subject above!
          </p>
        )}
      </div>
    </main>
  );
}
