/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import  getServerSession from 'next-auth'
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma'

// PATCH - แก้ไข Task
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, isCompleted } = body

    // ตรวจสอบว่า Task เป็นของ User คนนี้หรือไม่
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

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
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ตรวจสอบว่า Task เป็นของ User คนนี้หรือไม่
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    await prisma.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}