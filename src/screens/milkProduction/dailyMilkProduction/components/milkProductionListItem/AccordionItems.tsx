import { MilkProductionsCol, TableName } from '@/database/constants'
import MilkProduction from '@/database/models/MilkProduction'
import { milkProductionsKeys } from '@/queries/milkProduction/queryKeyFactory'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'
import { FlatList, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated'

type Props = {
  date: Date
  parentHeight: SharedValue<number>
}

const updateItemsRendering = (
  height: number,
  startRender: boolean,
  setStartRender: Dispatch<SetStateAction<boolean>>
) => {
  if (height > 0 && !startRender) {
    setStartRender(true)
  }
  if (height <= 0 && startRender) {
    setStartRender(false)
  }
}

export const AccordionItems = ({ date, parentHeight }: Props) => {
  const db = useDatabase()
  const theme = useAppTheme()
  const [startRender, setStartRender] = useState(false)

  const { data } = useQuery({
    queryKey: milkProductionsKeys.groupedByDate(date),
    queryFn: () =>
      db
        .get<MilkProduction>(TableName.MILK_PRODUCTIONS)
        .query(
          Q.unsafeSqlExpr(
            `date(${MilkProductionsCol.PRODUCED_AT} / 1000, 'unixepoch') = '${dayjs(date).format('YYYY-MM-DD')}'`
          )
        )
        .fetch()
  })

  useAnimatedReaction(
    () => parentHeight.value,
    () => {
      runOnJS(updateItemsRendering)(parentHeight.value, startRender, setStartRender)
    }
  )

  return (
    startRender && (
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={({ item }) => {
          return (
            <List.Item
              key={item.id}
              title={<Text variant='labelMedium'>Producción {item.productionNumber}</Text>}
              description={() => (
                <Text
                  style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
                  variant='labelSmall'
                >
                  {formatNumberWithSpaces(item.liters.toFixed(3))} L.
                </Text>
              )}
              right={({ style }) => (
                <View style={style}>
                  <Icon
                    size={24}
                    source='chevron-right'
                  />
                </View>
              )}
              style={{ paddingRight: 16 }}
              onPress={() => {}}
            />
          )
        }}
      />
    )
  )
}
