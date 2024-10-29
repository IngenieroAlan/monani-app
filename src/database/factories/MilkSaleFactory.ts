import { faker } from '@faker-js/faker'
import MilkProduction from '../models/MilkProduction'

const MIN_PRICE = 12
const MAX_PRICE = 18

const MilkSaleFactory = (milkProduction: MilkProduction, liters: number) => {
  const pricePerLiter = faker.number.float({ min: MIN_PRICE, max: MAX_PRICE, fractionDigits: 2 })

  return {
    details: `Producción ${milkProduction.productionNumber}`,
    liters: +(milkProduction.liters).toFixed(2),
    sold_by: +(liters * pricePerLiter).toFixed(2),
    milk_production_id: milkProduction.id,
    sold_at: milkProduction.producedAt.getTime()
  }
}

export default MilkSaleFactory
