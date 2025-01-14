export type PaginateIndexSlice = {
  paginateIndex: number
  nextIndex: () => void
  resetIndex: () => void
}

export type BetweenDatesSlice = {
  betweenDates: number[] | null
  setBetweenDates: (betweenDates: number[] | null) => void
}
