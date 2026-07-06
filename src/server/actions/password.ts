"use server";

import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { sendPasswordReset } from "@/lib/email";
import type { ActionResult } from "./auth";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const SITE_URL = process.env.NEXTAUTH_URL || "https://www.nannyora.co.nz";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");



/**
 * Start a password reset. Always reports success so attackers can't probe
 * which emails have accounts. Nannies and families only — admins reset via DB.
 */
export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const ok = { success: true, data: { message: "If that email has an account, a reset link is on its way." } };
  try {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) return ok;

    const now = Date.now();

    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user || user.role === "ADMIN") return ok; // no enumeration, no email-based admin reset

    // Durable throttle (survives serverless instances): a token minted in the
    // last 60s means a reset email just went out — same response, no resend.
    if (user.resetTokenExpiry && user.resetTokenExpiry.getTime() - TOKEN_TTL_MS > now - 60_000) return ok;

    const token = randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash: sha256(token), resetTokenExpiry: new Date(now + TOKEN_TTL_MS) },
    });

    await sendPasswordReset(user.name, user.email, `${SITE_URL}/reset-password?token=${token}`);
    return ok;
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    return ok; // same response even on failure — no oracle
  }
}

/** Complete a reset: valid unexpired token → new bcrypt hash, token cleared (single use). */
export async function resetPassword(token: string, password: string): Promise<ActionResult> {
  try {
    if (!token || token.length < 32) return { success: false, error: "Invalid or expired reset link." };
    if (!password || password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

    const user = await prisma.user.findFirst({
      where: { resetTokenHash: sha256(token), resetTokenExpiry: { gt: new Date() } },
    });
    if (!user) return { success: false, error: "Invalid or expired reset link. Please request a new one." };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(password, 10),
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("resetPassword error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
