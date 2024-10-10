import { faker } from '@faker-js/faker'
import { subMonths } from 'date-fns'

const MIN_PRICE = 50
const MAX_PRICE = 55

const MIN_SOLD_AT = subMonths(new Date(), 6)
const MAX_SOLD_AT = new Date()

const CattleSaleFactory = (cattleId: string, cattleWeight: number) => {
  const pricePerKg = faker.number.float({ min: MIN_PRICE, max: MAX_PRICE, fractionDigits: 2 })

  return {
    cattle_id: cattleId,
    sold_by: +(cattleWeight * pricePerKg).toFixed(2),
    sold_at: faker.date.between({ from: MIN_SOLD_AT, to: MAX_SOLD_AT }).getTime()
  }
}

export default CattleSaleFactory
