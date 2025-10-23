import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "Email not found." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 นาที

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expires },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  // ส่งอีเมล (ใช้ Mailtrap หรือ Gmail ก็ได้)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click here to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  return NextResponse.json({ message: "Reset link sent to your email." });
}
