import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { CattleArchivesCol as Column, TableName } from '../constants'
import Cattle from './Cattle'

export type ArchiveReason = 'Muerte' | 'Extravío' | 'Otro'

class CattleArchive extends Model {
  static table = TableName.CATTLE_ARCHIVES

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: Column.CATTLE_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text(Column.NOTES) notes?: string
  @date(Column.ARCHIVED_AT) archivedAt!: Date
  @field(Column.REASON) reason!: ArchiveReason

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>

  @writer
  async updateArchive({ reason, archivedAt, notes }: { reason: ArchiveReason; archivedAt: Date; notes?: string }) {
    await this.update((record) => {
      record.reason = reason
      record.archivedAt = archivedAt
      record.notes = notes
    })
  }
}

export default CattleArchive
