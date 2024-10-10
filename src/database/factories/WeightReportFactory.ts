import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import { differenceInDays, subWeeks } from 'date-fns'
import Cattle from '../models/Cattle'

const MIN_WEIGHT_FACTOR = 0.97
const MAX_WEIGHT_FACTOR = 1.01

const getFractionDigits = (n: number) => {
  if (Math.floor(n) === n) return 0

  return n.toString().split('.')[1].length || 0
}

const WeightReportFactory = (cattle: Cattle, numOfRecords: number = 1) => {
  let remainingWeight = cattle.weight
  const records: DirtyRaw[] = []

  for (let i = 0; i < numOfRecords; i++) {
    const weighedAt = subWeeks(new Date(), i + 1).getTime()

    records.push({
      cattle_id: cattle.id,
      weight: remainingWeight,
      weighed_at: weighedAt
    })

    const weightFactor = +faker.number.float({ min: MIN_WEIGHT_FACTOR, max: MAX_WEIGHT_FACTOR })

    remainingWeight = +(remainingWeight * weightFactor).toFixed(faker.number.int(3))

    if (i === 0) continue

    const fractionDigits = Math.max(getFractionDigits(records[i].weight), getFractionDigits(records[i - 1].weight))

    records[i - 1].weight_difference = +(records[i - 1].weight - records[i].weight).toFixed(fractionDigits)
    records[i - 1].days_passed = differenceInDays(new Date(records[i - 1].weighed_at), new Date(records[i].weighed_at))
    records[i - 1].avg_daily_difference = +(records[i - 1].weight_difference / records[i - 1].days_passed).toFixed(3)
  }

  const lastRecord = records[numOfRecords - 1]
  const fractionDigits = Math.max(getFractionDigits(lastRecord.weight), getFractionDigits(cattle.weight))
  const weightDifference = +(lastRecord.weight - cattle.weight).toFixed(fractionDigits)
  const daysPassed = differenceInDays(new Date(lastRecord.weighed_at), new Date(cattle.admittedAt))

  lastRecord.weight_difference = weightDifference
  lastRecord.days_passed = daysPassed
  lastRecord.avg_daily_difference = +(weightDifference / daysPassed).toFixed(3)

  return records
}

export default WeightReportFactory
