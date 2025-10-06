/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - แก้ไข Task
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, isCompleted } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE - ลบ Task
export async function DELETE(
  request: Request,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string; // ✅ ดึง id จาก Record
    await prisma.task.delete({
      where: { id }, // ✅ id เป็น string ตรงกับ Prisma schema
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
