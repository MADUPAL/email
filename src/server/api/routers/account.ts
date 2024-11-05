import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";

export const authorizeAccountAccess = async (accountId: string, userId: string) => {
  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId
    },
    select: {
      id: true, emailAddress: true, name: true, accessToken: true
    }
  })
  //user is trying to access an account which he doesnt own
  if (!account) {
    throw new Error('Account not found')
  }
  return account
}

export const accountRouter = createTRPCRouter({
  //to protect this route, go trpc.ts define middleware
  
  getAccounts: privateProcedure.query(async ({ctx}) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId
      },
      select: {
        id: true, emailAddress: true, name: true
      }
    })
  }),
  getNumThreads: privateProcedure.input(z.object({
    accountId: z.string(),
    tab: z.string(),

  })).query(async ({ctx, input}) => {
    const account = await authorizeAccountAccess(input.accountId, ctx.auth.userId)

    let filter: Prisma.ThreadWhereInput = {}
    if (input.tab === 'inbox') {
      filter.inboxStatus = true
    } else if (input.tab === 'draft') {
      filter.draftStatus = true
    } else if (input.tab === 'sent') {
      filter.sentStatus = true
    }

    return await ctx.db.thread.count({
      where: {
        accountId: account.id,
        ...filter
      }
    })
  })
})