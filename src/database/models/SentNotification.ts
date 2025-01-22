import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, json, nochange, readonly, writer } from '@nozbe/watermelondb/decorators'
import { SentNotificationsCol as Column, TableName } from '../constants'
import Cattle from './Cattle'

export type NotificationType = 'quarantine' | 'medication' | 'birth'

class SentNotification extends Model {
  static table = TableName.SENT_NOTIFICATIONS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: Column.CATTLE_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field(Column.TYPE) type!: NotificationType
  @nochange @field(Column.NOTIFEE_ID) notifeeId!: string

  @json(Column.EXTRA_INFO, (json) => json) extraInfo?: string[]

  @date(Column.EVENT_AT) eventAt!: Date
  @field(Column.IS_MARKED_AS_READ) isMarkedAsRead!: boolean

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>

  @writer async markAsRead() {
    await this.update((record) => {
      record.isMarkedAsRead = true
    })
  }

  @writer async deleteNoti() {
    await this.destroyPermanently()
  }
}

export default SentNotification
