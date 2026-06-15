"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function registerUser(input: RegisterInput): Promise<ActionResult> {
  try {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const { name, email, phone, password, role } = parsed.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role,
      },
    });

    return { success: true, data: { userId: user.id, role: user.role } };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
