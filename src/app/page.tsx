
export default function Home() {
  return (
    <main className="min-h-screen bg-violet-50 px-6 py-10 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-violet-700">
            ✨ StudyFlow
          </h1>
          <span className="rounded-full bg-white px-4 py-2 text-sm text-violet-600 shadow-sm">
            Student Planner
          </span>
        </header>

        <section className="mb-10">
          <h2 className="mb-3 text-4xl font-bold">
            Welcome to StudyFlow!
          </h2>
          <p className="text-lg text-slate-500">
            Organize your studies, track assignments, and never miss a deadline.
          </p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["📊", "Dashboard", "Track your academic progress"],
            ["📚", "Subjects", "Organize your courses"],
            ["📝", "Assignments", "Manage your tasks and deadlines"],
            ["📅", "Calendar", "See your upcoming deadlines"],
          ].map(([icon, title, description]) => (
            <a
  href={
    title === "Dashboard" ? "/dashboard" :
    title === "Subjects" ? "/subjects" :
    title === "Assignments" ? "/assignments" :
    "/calendar"
  }
              key={title}
              className="rounded-2xl bg-white p-7 shadow-sm"
            >
              <div className="mb-4 text-3xl">{icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-slate-500">{description}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
