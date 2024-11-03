import { EarningsRecord } from '@/hooks/collections/useEarnings'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider, Icon, Text } from 'react-native-paper'
import EarningsListSection from './EarningsListSection'

type Props = Omit<FlashListProps<EarningsRecord>, 'renderItem'> &
  Partial<Pick<FlashListProps<EarningsRecord>, 'renderItem'>>

const EmptyList = () => {
  return (
    <View style={styles.emptyList}>
      <Icon
        size={56}
        source='magnify-remove-outline'
      />
      <Text
        style={{ textAlign: 'center' }}
        variant='titleMedium'
      >
        No se han encontrado resultados.
      </Text>
    </View>
  )
}

const EarningsList = (props: Props) => {
  const renderItem = useCallback(({ item }: { item: EarningsRecord }) => {
    return <EarningsListSection records={item} />
  }, [])

  const keyExtractor = useCallback((item: any, index: number) => {
    return index.toString()
  }, [])

  return props.data?.length ? (
    <FlashList
      estimatedItemSize={80}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Divider />}
      onEndReachedThreshold={2}
      {...props}
    />
  ) : (
    <EmptyList />
  )
}

const styles = StyleSheet.create({
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    flex: 1
  }
})

export default memo(EarningsList)
