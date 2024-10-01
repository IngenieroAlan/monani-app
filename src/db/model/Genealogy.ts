import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'

class Genealogy extends Model {
  static table = TableName.GENEALOGY

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @field('mother_id') motherId!: string
  @field('offspring_id') offspringId!: string
}

export default Genealogy
