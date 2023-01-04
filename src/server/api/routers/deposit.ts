import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

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
      let deposit = await ctx.prisma.deposit.findFirst({
        where: {
          userId: ctx.session.user.id,
          series: input.series,
          number: input.number
        }
      });
      if (deposit) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Egy betét már létezik a megadott sorozattal és/vagy sorszámmal.',
        });
      }

      deposit = await ctx.prisma.deposit.create({
        data: {
          userId: ctx.session.user.id,
          series: input.series,
          number: input.number
        }
      });
      return deposit;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const deposit = await ctx.prisma.deposit.delete({
        where: {
          id: input.id
        }
      });
      return deposit;
    })
});
