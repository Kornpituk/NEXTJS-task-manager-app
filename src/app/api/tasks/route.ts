/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ดึงรายการ Tasks ทั้งหมด
// src/app/api/tasks/route.ts
export async function GET() {
  try {
    // ✅ เช็ค Prisma connection
    await prisma.$connect();
    
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // ✅ Ensure return array
    return NextResponse.json(Array.isArray(tasks) ? tasks : []);
    
  } catch (err: any) {
    console.error("Fetch Tasks Error:", err);
    
    // ✅ ส่ง empty array กลับแทน error (เพื่อไม่ให้ frontend crash)
    return NextResponse.json([], { 
      status: 200, // เปลี่ยนเป็น 200 แต่ส่ง []
      headers: {
        'X-Error': 'Database connection failed'
      }
    });
    
  } finally {
    await prisma.$disconnect();
  }
}

// POST - สร้าง Task ใหม่
export async function POST(request: Request) {
  try {
    await prisma.$connect(); // ✅ เพิ่ม
    
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
    
  } catch (err: any) {
    console.error("Create Task Error:", err);
    return NextResponse.json(
      { error: "Failed to create task", details: err.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // ✅ เพิ่ม
  }
}
