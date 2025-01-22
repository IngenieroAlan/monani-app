import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date, field, immutableRelation, nochange, readonly, writer } from '@nozbe/watermelondb/decorators';
import { PendingNotificationsCol as Column, TableName } from '../constants';
import Cattle from './Cattle';
import { NotificationType } from './SentNotification';

class PendingNotification extends Model {
  static table = TableName.PENDING_NOTIFICATIONS

  static associations: Associations = {
    [TableName.CATTLE]: { type: 'belongs_to', key: Column.CATTLE_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field(Column.TYPE) type!: NotificationType

  @field(Column.FOREIGN_ID) foreignId?: string

  @immutableRelation(TableName.CATTLE, Column.CATTLE_ID) cattle!: Relation<Cattle>

  @writer
  async delete() {
    await this.destroyPermanently()
  }
}

export default PendingNotification
