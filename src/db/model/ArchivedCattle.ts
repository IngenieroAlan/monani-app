import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, text } from '@nozbe/watermelondb/decorators'
import { ArchiveReason, TableName } from '../types'
import Cattle from './Cattle'

class ArchivedCattle extends Model {
  static table = TableName.ARCHIVED_CATTLE

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('notes') notes?: string
  @date('date') date!: Date
  @field('reason') reason!: ArchiveReason

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
}

export default ArchivedCattle
