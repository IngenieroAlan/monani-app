import { Model, Query, Relation } from '@nozbe/watermelondb'
import { date, immutableRelation, readonly, relation } from '@nozbe/watermelondb/decorators'
import { TableName } from '../schema'
import Cattle from './Cattle'
import { Associations } from '@nozbe/watermelondb/Model'

class Genealogy extends Model {
  static table = TableName.GENEALOGY

  static associations: Associations = {
    [TableName.CATTLE]: { type: 'belongs_to', key: 'offspring_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @relation('cattle', 'mother_id') mother!: Relation<Cattle>
  @relation('cattle', 'offspring_id') offspring!: Relation<Cattle>
}

export default Genealogy
