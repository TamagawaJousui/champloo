import useSWR from 'swr'
import {
  getDefaultCollageList,
  getUserCollageList,
  getOtherCollageList,
  getUserWorkList,
  getOtherWorkList,
  getCollageFromSelectedCollage
} from '@/firebase/storage'

export function useDefaultCollageList() {
  return useSWR('defaultCollageList', () => getDefaultCollageList())
}

export function useUserCollageList(visitorId: string) {
  return useSWR(
    visitorId ? ['userCollageList', visitorId] : null,
    () => getUserCollageList(visitorId)
  )
}

export function useOtherCollageList(visitorId: string) {
  return useSWR(
    visitorId ? ['otherCollageList', visitorId] : null,
    () => getOtherCollageList(visitorId)
  )
}

export function useUserWorkList(visitorId: string) {
  return useSWR(
    visitorId ? ['userWorkList', visitorId] : null,
    () => getUserWorkList(visitorId)
  )
}

export function useOtherWorkList(visitorId: string) {
  return useSWR(
    visitorId ? ['otherWorkList', visitorId] : null,
    () => getOtherWorkList(visitorId)
  )
}

export function useSelectedCollages(collagePath: Set<string>) {
  return useSWR(
    collagePath.size > 0 ? ['selectedCollages', Array.from(collagePath)] : null,
    () => getCollageFromSelectedCollage(collagePath)
  )
} 