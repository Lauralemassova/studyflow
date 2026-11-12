
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load subjects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Subject name is required" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name: body.name.trim(),
        color:
          typeof body.color === "string" &&
          /^#[0-9a-fA-F]{6}$/.test(body.color)
            ? body.color
            : "#8b5cf6",
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}
