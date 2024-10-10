import { faker } from '@faker-js/faker'
import { MatterProportion } from '../models/Diet'

const MIN_MATTER_AMOUNT = 14
const MAX_MATTER_AMOUNT = 25

const MIN_WATER_AMOUNT = 50
const MAX_WATER_AMOUNT = 75

const MIN_PERCENTAGE = 2.5
const MAX_PERCENTAGE = 4.5

const getMatterProportion = () => {
  const proportions: MatterProportion[] = ['Fija', 'Procentaje de peso', 'Sin definir']

  return faker.helpers.arrayElement(proportions)
}

const DietFactory = (cattleWeight: number) => {
  const matterProportion = getMatterProportion()
  let matterAmount: number | undefined
  let percentage: number | undefined

  switch (matterProportion) {
    case 'Fija':
      matterAmount = faker.number.float({
        min: MIN_MATTER_AMOUNT,
        max: MAX_MATTER_AMOUNT,
        fractionDigits: 3
      })

      break

    case 'Procentaje de peso':
      percentage = faker.number.float({
        min: MIN_PERCENTAGE,
        max: MAX_PERCENTAGE,
        fractionDigits: 1
      })
      matterAmount = +(cattleWeight * (percentage / 100)).toFixed(3)

      break
  }

  return {
    water_amount: faker.number.int({ min: MIN_WATER_AMOUNT, max: MAX_WATER_AMOUNT }),
    matter_proportion: matterProportion,
    matter_amount: matterAmount,
    percentage: percentage,
    is_concentrate_excluded: faker.datatype.boolean()
  }
}

export default DietFactory
