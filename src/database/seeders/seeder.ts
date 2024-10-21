import CattleArchiveSeeder from './CattleArchiveSeeder'
import CattleSaleSeeder from './CattleSaleSeeder'
import DietCattleSeeder from './DietCattleSeeder'
import DietFeedSeeder from './DietFeedSeeder'
import FeedSeeder from './FeedSeeder'
import GenealogySeeder from './GenealogySeeder'
import MedicationScheduleSeeder from './MedicationScheduleSeeder'
import MedicationSeeder from './MedicationSeeder'
import MilkProductionSeeder from './MilkProductionSeeder'
import MilkSaleSeeder from './MilkSaleSeeder'
import NotificationSeeder from './NotificationSeeder'
import WeightReportSeeder from './WeightReportSeeder'

async function seedDatabase() {
  await FeedSeeder()
  await DietCattleSeeder() // Seeds both diet and cattle table.
  await DietFeedSeeder()
  await MedicationSeeder()
  await MedicationScheduleSeeder()
  await WeightReportSeeder()
  await CattleSaleSeeder()
  await CattleArchiveSeeder()
  await MilkProductionSeeder()
  await MilkSaleSeeder()
  await GenealogySeeder()
  await NotificationSeeder()
}

export default seedDatabase
