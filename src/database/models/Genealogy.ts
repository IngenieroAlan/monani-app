import { Model, Relation } from '@nozbe/watermelondb'
import { date, readonly, relation } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model'
import { GenealogyCol as Column, TableName } from '../constants'
import Cattle from './Cattle'

class Genealogy extends Model {
  static table = TableName.GENEALOGY

  static associations: Associations = {
    [TableName.CATTLE]: { type: 'belongs_to', key: Column.OFFSPRING_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @relation(TableName.CATTLE, Column.MOTHER_ID) mother!: Relation<Cattle>
  @relation(TableName.CATTLE, Column.OFFSPRING_ID) offspring!: Relation<Cattle>
}

export default Genealogy
