import NextAuth from "next-auth";
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Credenciais inválidas.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Evite qualquer log de senha (mesmo hasheada)
        if (!user || !user.password) {
          throw new Error("Usuário ou senha incorretos.");
        }

        const passwordMatches = await compare(
          credentials.password,
          user.password
        );

        if (!passwordMatches) {
          throw new Error("Usuário ou senha incorretos.");
        }

        return user;
      },
    }),
  ],
  pages: {
    newUser: "/auth",
  },
  callbacks: {
    async signIn({ user }) {
      return !!user.email;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
