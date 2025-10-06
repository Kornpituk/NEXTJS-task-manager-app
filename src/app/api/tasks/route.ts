import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ดึงรายการ Tasks ทั้งหมด
// src/app/api/tasks/route.ts
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (err) {
    // เปลี่ยนจาก error เป็น err
    console.error("Fetch Tasks Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST - สร้าง Task ใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    // เปลี่ยนจาก error เป็น err
    console.error("Create Task Error:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
