import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { registerHandler } from "../../controllers/auth.controller";
import { createUserSchema } from "../../schema/user.schema";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => ctx.session),

  registerUser: publicProcedure
    .input(createUserSchema)
    .mutation(({ input }) => registerHandler({ input })),

  loginUser: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.password) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais inválidas" });
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);
      if (!passwordMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais inválidas" });
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        birthdate: true,
        dniName: true,
        dni: true,
        image: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      dni: z.string().optional(),
      dniName: z.string().optional(),
      phone: z.string().optional(),
      birthdate: z.string().optional(), // ISO string
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          dni: input.dni,
          dniName: input.dniName,
          phone: input.phone,
          birthdate: input.birthdate ? new Date(input.birthdate) : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthdate: true,
          dni: true,
          dniName: true,
          role: true,
        },
      });

      return updatedUser;
    }),

  getUserById: protectedProcedure
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
    }),
});
