import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'
import { TableName } from '../types'

class Notification extends Model {
  static table = TableName.NOTIFICATIONS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @date('date') date!: Date
  @field('title') title!: string
  @field('description') description!: string
  @field('icon_name') iconName!: string
  @field('is_marked_as_read') isMarkedAsRead!: boolean
}

export default Notification
