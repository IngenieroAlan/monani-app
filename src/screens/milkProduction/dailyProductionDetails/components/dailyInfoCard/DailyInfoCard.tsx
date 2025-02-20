import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'
import { LitersDifference } from './LitersDifference'
import { TotalEarnings } from './TotalEarnings'

type Props = {
  totalLiters: number
  productionTimestamp: number
}

export const DailyInfoCard = ({ totalLiters, productionTimestamp }: Props) => {
  const theme = useAppTheme()

  return (
    <Card mode='outlined'>
      <Card.Content style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <View>
            <Text
              variant='labelMedium'
              style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
            >
              Total de litros producidos
            </Text>
            <Text variant='displayMedium'>{formatNumberWithSpaces(totalLiters.toFixed(3))} L.</Text>
          </View>
          <LitersDifference
            totalLiters={totalLiters}
            productionTimestamp={productionTimestamp}
          />
        </View>
        <Divider horizontalInset />
        <TotalEarnings productionTimestamp={productionTimestamp} />
      </Card.Content>
    </Card>
  )
}
