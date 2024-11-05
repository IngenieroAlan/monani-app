import ExpandableBottomSheet from '@/components/ExpandableBottomSheet'
import { EarningsRecord } from '@/hooks/collections/useEarnings'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { memo } from 'react'
import EarningsList from '../EarningsList/EarningsList'
import EarningsListFilters from '../EarningsListFilters/EarningsListFilters'

type Props = {
  earningsRecords?: EarningsRecord[]
  index: number
  setIndex: (n: number) => void
}

const ExpandableEarningsList = ({ earningsRecords, index, setIndex }: Props) => {
  return (
    <ExpandableBottomSheet>
      <BottomSheetView style={{ flex: 1 }}>
        <EarningsListFilters />
        <EarningsList
          data={earningsRecords}
          onEndReached={() => setIndex(index + 1)}
        />
      </BottomSheetView>
    </ExpandableBottomSheet>
  )
}

export default memo(ExpandableEarningsList)
