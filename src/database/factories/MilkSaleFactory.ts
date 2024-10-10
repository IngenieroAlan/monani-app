import { faker } from '@faker-js/faker'
import { subYears } from 'date-fns'

const MIN_PRICE = 12
const MAX_PRICE = 18

const MIN_SOLD_AT = subYears(new Date(), 2)
const MAX_SOLD_AT = new Date()

const MilkSaleFactory = (milkProductionId: string, liters: number) => {
  const pricePerLiter = faker.number.float({ min: MIN_PRICE, max: MAX_PRICE, fractionDigits: 2 })

  return {
    milk_production_id: milkProductionId,
    sold_by: +(liters * pricePerLiter).toFixed(2),
    sold_at: faker.date.between({ from: MIN_SOLD_AT, to: MAX_SOLD_AT }).getTime()
  }
}

export default MilkSaleFactory
