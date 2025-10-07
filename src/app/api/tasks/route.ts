/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ดึงรายการ Tasks ทั้งหมด
// src/app/api/tasks/route.ts
// app/api/tasks/[id]/route.ts
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, isCompleted } = body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
