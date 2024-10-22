import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'

const useCattle = () => {
  const database = useDatabase()

  const getCattle = async (extend: Q.Clause[]) => {
    return await database.collections
      .get<Cattle>(TableName.CATTLE)
      .query()
      .extend(extend)
      .fetch()
  }

  // TODO: create, update, delete, archive, sold, set diet, set medications, set offsprings, set mother, etc.

  return {
    getCattle
  }
}

export default useCattle
