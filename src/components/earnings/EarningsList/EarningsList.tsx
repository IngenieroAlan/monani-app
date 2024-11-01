import useEarnings, { EarningsRecord } from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import { FlashList } from '@shopify/flash-list'
import { memo, useCallback, useState } from 'react'
import { Divider } from 'react-native-paper'
import EarningsListSection from './EarningsListSection'

const ITEMS_PER_PAGINATE = 25

const EarningsList = () => {
  const [index, setIndex] = useState(0)
  const { earningsRecords } = useEarnings({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index,
    salesType: useAppSelector((state: RootState) => state.earningsQuery.eqSalesType)
  })

  const renderItem = useCallback(({ item }: { item: EarningsRecord }) => {
    return <EarningsListSection records={item} />
  }, [])

  const keyExtractor = useCallback((item: any, index: number) => {
    return index.toString()
  }, [])

  return (
    <FlashList
      estimatedItemSize={80}
      data={earningsRecords}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Divider />}
      onEndReachedThreshold={2}
      onEndReached={() => setIndex(index + 1)}
    />
  )
}

export default memo(EarningsList)
