import { SurfaceContainer } from '@/components/SurfaceContainer'
import Cattle from '@/database/models/Cattle'
import useCattleArchive from '@/hooks/collections/useCattleArchive'
import useCattleSale from '@/hooks/collections/useCattleSale'
import { useAppSelector } from '@/hooks/useRedux'
import { withObservables } from '@nozbe/watermelondb/react'
import { ScrollView, View } from 'react-native'
import ArchiveCard from '../Components/info/cards/ArchiveCard'
import BiologicalInfoCard from '../Components/info/cards/BiologicalInfoCard'
import GeneralInfoCard from '../Components/info/cards/GeneralInfoCard'
import PregnancyCard from '../Components/info/cards/PregnancyCard'
import ProductionStatusCard from '../Components/info/cards/ProductionStatusCard'
import QuarantineCard from '../Components/info/cards/QuarantineCard'
import SaleCard from '../Components/info/cards/SaleCard'

export const InfoRoute = () => {
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)

  return (
    <SurfaceContainer Component={ScrollView}>
      <CattleInfoDetails cattle={cattle!} />
    </SurfaceContainer>
  )
}

const withCattleObserver = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const CattleInfoDetails = withCattleObserver(({ cattle }: { cattle: Cattle }) => {
  const { cattleArchive } = useCattleArchive(cattle!)
  const { cattleSale } = useCattleSale(cattle!)

  return (
    <View style={{ gap: 24, padding: 16 }}>
      {cattle.quarantineEndsAt && !cattleSale && !cattleArchive && (
        <QuarantineCard quarantineEndsAt={cattle.quarantineEndsAt} />
      )}
      {cattleSale && <SaleCard sale={cattleSale} />}
      {cattleArchive && <ArchiveCard archive={cattleArchive} />}
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
      {cattle.pregnantAt && !cattleArchive && <PregnancyCard pregnantAt={cattle.pregnantAt} />}
    </View>
  )
})
