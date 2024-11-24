import Cattle from '@/database/models/Cattle'
import useCattleArchive from '@/hooks/collections/useCattleArchive'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import { withObservables } from '@nozbe/watermelondb/react'
import { ScrollView, View } from 'react-native'
import ArchiveCard from '../Components/info/cards/ArchiveCard'
import BiologicalInfoCard from '../Components/info/cards/BiologicalInfoCard'
import GeneralInfoCard from '../Components/info/cards/GeneralInfoCard'
import PregnancyCard from '../Components/info/cards/PregnancyCard'
import ProductionStatusCard from '../Components/info/cards/ProductionStatusCard'

export const InfoRoute = () => {
  const theme = useAppTheme()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)

  return (
    <ScrollView style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <CattleInfoDetails cattle={cattle!} />
    </ScrollView>
  )
}

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const CattleInfoDetails = observeCattle(({ cattle }: { cattle: Cattle }) => {
  const { cattleArchive } = useCattleArchive(cattle!)

  return (
    <View style={{ gap: 24, padding: 16 }}>
      {cattleArchive !== undefined && <ArchiveCard archive={cattleArchive} />}
      <GeneralInfoCard
        name={cattle.name}
        tagId={cattle.tagId}
        tagCattleNumber={cattle.tagCattleNumber}
        admittedAt={cattle.admittedAt}
      />
      <BiologicalInfoCard
        weight={cattle.weight}
        bornAt={cattle.bornAt}
        archive={cattleArchive}
      />
      <ProductionStatusCard
        productionType={cattle.productionType}
        cattleStatus={cattle.cattleStatus}
      />
      {cattle.pregnantAt && cattleArchive === undefined && <PregnancyCard pregnantAt={cattle.pregnantAt} />}
    </View>
  )
})
