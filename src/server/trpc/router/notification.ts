import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { findNewAccountNotification } from "@/server/utils/findNewAccountNotification";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.notification.delete({
        where: { id: input.id },
      });
    }),

  createNotification: protectedProcedure
    .input(z.object({
      userId: z.string().cuid(),
      title: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.title === "¡Acabas de crear tu cuenta con exito!") {
        const isBlocked = await findNewAccountNotification(
          ctx,
          input.title,
          input.userId
        );
        if (isBlocked) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      return ctx.prisma.notification.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.notification.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),
});
