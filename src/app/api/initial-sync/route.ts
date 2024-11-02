// /api/initial-sync
import { Account } from "@/lib/account";
import { db } from "@/server/db";
import { detectContentType } from "next/dist/server/image-optimizer";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) => {
  const {accountId, userId} = await req.json()

  if (!accountId || !userId) {
    return NextResponse.json({error: 'Missing accountId or userId' }, {status: 400})
  }

  const dbAccount = await db.account.findUnique({
    where: {
      id: accountId,
      userId
    }
  })
  if (!dbAccount) return NextResponse.json({error: 'Account not found' }, {status: 404})
  
  //22207
  const account = new Account(dbAccount.accessToken)
  const response = await account.performInitialSync()
  if (!response) {
    return NextResponse.json({error:'Failed to perform intitial sync'}, {status: 500})
  }

  const {emails, deltaToken} = response

  await db.account.update({
    where: {
      id: accountId,
    },
    data: {
      nextDeltaToken: deltaToken
    }
  })
}