import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date, field, immutableRelation, nochange, readonly, writer } from '@nozbe/watermelondb/decorators';
import { TableName } from '../schema';
import Cattle from './Cattle';
import { NotificationType } from './SentNotification';

class PendingNotification extends Model {
  static table = TableName.PENDING_NOTIFICATIONS

  static associations: Associations = {
    [TableName.CATTLE]: { type: 'belongs_to', key: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field('type') type!: NotificationType
  @nochange @field('notifee_id') notifeeId!: string

  @field('foreign_id') foreignId?: string

  @immutableRelation(TableName.CATTLE, 'cattle_id') cattle!: Relation<Cattle>

  @writer
  async delete() {
    await this.destroyPermanently()
  }
}

export default PendingNotification
