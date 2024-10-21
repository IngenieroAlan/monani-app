import { faker } from '@faker-js/faker'
import { subMonths } from 'date-fns'

const MIN_EVENT_AT = subMonths(new Date(), 6)
const MAX_EVENT_AT = new Date()

const possibleIcons = [
  'minus-circle-off-outline',
  'pill',
  'baby-bottle-outline',
  'cow-off',
  'cow',
]

const NotificationFactory = () => {
  return {
    event_at: faker.date.between({ from: MIN_EVENT_AT, to: MAX_EVENT_AT }).getTime(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    icon_name: faker.helpers.arrayElement(possibleIcons),
    is_marked_as_read: faker.datatype.boolean(),
  }
}

export default NotificationFactory
