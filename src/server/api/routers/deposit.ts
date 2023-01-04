import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const depositRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session?.user) {
      return [];
    }

    return ctx.prisma.deposit.findMany({
      where: {
        userId: ctx.session.user.id
      }
    });
  }),
  add: protectedProcedure
    .input(z.object({ series: z.string().min(1), number: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const deposit = await ctx.prisma.deposit.create({
        data: {
          userId: ctx.session.user.id,
          series: input.series,
          number: input.number
        }
      });
      return deposit;
    })
});
