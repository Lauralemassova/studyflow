# StudyFlow - Project Instructions

This project is a student assignment and deadline management web application called StudyFlow.

The application is deployed on Railway automatically from the main branch of this GitHub repository.

The database is PostgreSQL hosted on Railway. Access the database only through the DATABASE_URL environment variable configured in Railway.

Do not set up a local database or local application server.

Use Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM and PostgreSQL.

The application must support:
- Dashboard with assignment statistics and progress tracking.
- Academic subject management.
- Assignment creation, editing and deletion.
- Assignment priorities and statuses.
- Deadline tracking and a monthly calendar.
- Responsive design for desktop and mobile devices.

The user interface language is English.

Use a modern, minimalistic design with white, lavender and violet colors.

This is a single-workspace academic demonstration application. Do not implement user registration or authentication.

Store subjects and assignments in Railway PostgreSQL, not localStorage.

Before every push to GitHub, run npm run build to verify that the application builds successfully.

After each completed development task, commit and push changes to the main branch so Railway can automatically deploy the new version.

Exception: When working on a separate feature branch for a pull request, follow the specific instructions for that task and do not automatically push to main.

Never hard-code database credentials or other secrets.

If Railway deployment fails, investigate the error and fix the problem before continuing.