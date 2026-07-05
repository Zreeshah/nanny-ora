import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
if (!secret) {
  throw new Error(
    "AUTH_SECRET is required. Set it in .env (dev) or Vercel env vars (prod)."
  );
}

// Emergency admin access — works without database. Fail closed: if the env
// vars are not set, no backup account exists (no hardcoded credential in code).
const BACKUP_ADMIN_EMAIL = process.env.ADMIN_BACKUP_EMAIL;
const BACKUP_ADMIN_PASSWORD = process.env.ADMIN_BACKUP_PASSWORD;

export const { handlers, auth } = NextAuth({
  secret,
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7 days
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Emergency admin access — no DB required. Active only when BOTH env
        // vars are set; otherwise this path does not exist.
        if (
          BACKUP_ADMIN_EMAIL &&
          BACKUP_ADMIN_PASSWORD &&
          email === BACKUP_ADMIN_EMAIL &&
          password === BACKUP_ADMIN_PASSWORD
        ) {
          return { id: "backup-admin", email, name: "Admin", role: "ADMIN" };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Prisma error during login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});
