import { faker } from '@faker-js/faker'
import { subMonths } from 'date-fns'
import Cattle from '../models/Cattle'
import Medication from '../models/Medication'
import { NotificationType } from '../models/SentNotification'

const MIN_EVENT_AT = subMonths(new Date(), 6)
const MAX_EVENT_AT = new Date()

const getType = () => {
  const types: NotificationType[] = ['birth', 'quarantine', 'medication']

  return faker.helpers.arrayElement(types)
}

const NotificationFactory = (cattle: Cattle, medication: Medication) => {
  const type = getType()

  return {
    event_at: faker.date.between({ from: MIN_EVENT_AT, to: MAX_EVENT_AT }).getTime(),
    is_marked_as_read: faker.datatype.boolean(),
    cattle_id: cattle.id,
    extra_info: JSON.stringify(type === 'medication' ? [medication.name, cattle.tagId] : [cattle.tagId]),
    type,
    foreign_id: medication.id
  }
}

export default NotificationFactory
