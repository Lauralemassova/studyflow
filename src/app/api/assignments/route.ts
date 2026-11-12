
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const priorities = ["Low", "Medium", "High"];

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      typeof body.dueDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) ||
      !Number.isFinite(Date.parse(`${body.dueDate}T12:00:00Z`))
    ) {
      return NextResponse.json(
        { error: "Valid title and due date are required" },
        { status: 400 }
      );
    }

    const priority = priorities.includes(body.priority)
      ? body.priority
      : "Medium";

    const subjectId =
      typeof body.subjectId === "string" && body.subjectId
        ? body.subjectId
        : null;

    if (subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) {
        return NextResponse.json(
          { error: "Subject not found" },
          { status: 404 }
        );
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: body.title.trim(),
        description:
          typeof body.description === "string"
            ? body.description.trim()
            : "",
        dueDate: new Date(`${body.dueDate}T12:00:00Z`),
        priority,
        status: "Pending",
        subjectId,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
