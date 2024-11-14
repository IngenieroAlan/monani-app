import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, json, nochange, readonly, writer } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'

export type NotificationType = 'quarantine' | 'medication' | 'birth'

class SentNotification extends Model {
  static table = TableName.SENT_NOTIFICATIONS

  static associations = {
    [TableName.CATTLE]: { type: 'belongs_to' as const, key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field('type') type!: NotificationType
  @nochange @field('notifee_id') notifeeId!: string

  @json('extra_info', (json) => json) extraInfo?: string[]

  @date('event_at') eventAt!: Date
  @field('is_marked_as_read') isMarkedAsRead!: boolean

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>

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
