import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ message: "Invalid or expired token." });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ message: "Password updated successfully." });
}
