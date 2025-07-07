import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { User as PrismaUser } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password) return null;

        const passwordValid = await compare(credentials.password, user.password);
        if (!passwordValid) return null;

        // ✅ Retorna objeto compatível com NextAuth.User
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role, // obrigatório conforme seu next-auth.d.ts
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  newUser: "/auth",
  error: "/login?error=1",
  },

  callbacks: {
    async signIn({ user }) {
      return !!user.email;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as PrismaUser).role;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      // Redireciona sempre para /user após login, ignorando URL de origem
      return `${baseUrl}/user`;
    },
  },
};
