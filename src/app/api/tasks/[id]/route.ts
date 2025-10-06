/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - แก้ไข Task
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, isCompleted } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE - ลบ Task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: { id: (params.id) }, // ✅ แปลงเป็น Number
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error); // ✅ ใช้งาน error ป้องกัน warning
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}