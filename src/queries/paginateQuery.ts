import { Model, Q, Query } from '@nozbe/watermelondb'
import { InteractionManager } from 'react-native'

const PAGE_SIZE = 25

export const paginateQuery = async <T extends Model>(query: Query<T>, page: number) => {
  const [results, nextPagePreview] = await Promise.allSettled([
    query.extend(Q.skip(PAGE_SIZE * page), Q.take(PAGE_SIZE)).fetch(),
    query.extend(Q.skip(PAGE_SIZE * (page + 1)), Q.take(1)).fetchIds()
  ])

  if (results.status === 'rejected') {
    console.error(`[🍉] ${results.reason}`)
  }
  if (nextPagePreview.status === 'rejected') {
    console.error(`[🍉] ${nextPagePreview.reason}`)
  }

  return new Promise<{ results: T[]; nextPage: number | null }>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve({
        results: results.status === 'fulfilled' ? results.value : [],
        nextPage: nextPagePreview.status === 'fulfilled' && nextPagePreview.value.length > 0 ? page + 1 : null
      })
    })
  })
}
