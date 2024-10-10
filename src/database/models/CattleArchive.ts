import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, text } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'

export type ArchiveReason = 'Muerte' | 'Extravío' | 'Otro'

class CattleArchive extends Model {
  static table = TableName.CATTLE_ARCHIVES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('notes') notes?: string
  @date('archived_at') archivedAt!: Date
  @field('reason') reason!: ArchiveReason

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>
}

export default CattleArchive
