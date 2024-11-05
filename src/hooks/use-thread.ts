import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import {atom, useAtom} from 'jotai';
//jotai 35400
export const threadIdAtom = atom<string | null>(null);

const useThreads = () => {
  const {data: accounts} = api.account.getAccounts.useQuery()
  const [accountId] = useLocalStorage("accountId", '')
  const [tab] = useLocalStorage("inbox-tab", 'inbox')
  const [done] = useLocalStorage("tab-done", false)
  const [threadId, setThreadId] = useAtom(threadIdAtom)

  //tab is changed => placeholderData allows the data to be rendered statically without flashing
  //in and out of screen
  const {data : threads, isFetching, refetch} = api.account.getThreads.useQuery({
    accountId,
    tab,
    done
  }, {
    enabled: !!accountId && !!tab, placeholderData: e => e, refetchInterval: 5000
  })

  return {
    threads,
    isFetching,
    refetch,
    accountId,
    threadId,
    setThreadId,
    account: accounts?.find(e => e.id === accountId)
  }
}

export default useThreads