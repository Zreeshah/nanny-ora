import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "nannyora-dev-secret-change-in-production",
  session: { strategy: "jwt" },
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

        // Demo accounts remain available before the production database is configured.
        if (password === "demo1234") {
          if (process.env.DATABASE_URL?.trim()) {
            try {
              const dbUser = await prisma.user.findUnique({ where: { email } });
              if (dbUser) {
                return {
                  id: dbUser.id,
                  email: dbUser.email,
                  name: dbUser.name,
                  role: dbUser.role,
                  image: dbUser.image,
                };
              }
            } catch (error) {
              console.error("Prisma error during demo login bypass:", error);
            }
          }

          if (email === "admin@nannyora.co.nz") {
            return { id: "demo-admin", email, name: "Admin User", role: "ADMIN" };
          }
          if (email === "emma@nannyora.co.nz") {
            return { id: "demo-nanny", email, name: "Emma T.", role: "NANNY" };
          }
          if (email === "parent@nannyora.co.nz") {
            return { id: "demo-parent", email, name: "Parent User", role: "PARENT" };
          }
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
