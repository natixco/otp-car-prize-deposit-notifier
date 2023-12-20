import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { deposits } from '../../db/db-schema';
import { eq } from 'drizzle-orm';

export const depositRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session?.user) {
      return [];
    }

    return ctx.db.query.deposits.findMany({
      where: (deposits, { eq }) => eq(deposits.userId, ctx.session.user.id),
    });
  }),
  add: protectedProcedure
    .input(z.object({ series: z.string().min(1), number: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existingDeposit = await ctx.db.query.deposits.findFirst({
        where: (deposits, { and, eq }) => and(
          eq(deposits.userId, ctx.session.user.id),
          eq(deposits.series, input.series),
          eq(deposits.number, input.number)),
      });
      if (existingDeposit) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Egy betét már létezik a megadott sorozattal és/vagy sorszámmal.',
        });
      }

      const deposit = await ctx.db.insert(deposits).values({
        userId: ctx.session.user.id,
        series: input.series,
        number: input.number,
      });
      return deposit;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const deposit = await ctx.db.delete(deposits).where(eq(deposits.id, input.id));
      return deposit;
    })
});
