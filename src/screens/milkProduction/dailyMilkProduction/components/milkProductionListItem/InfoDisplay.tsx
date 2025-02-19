import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'

type Props = {
  producedAtTimestamp: number
  liters: number
  totalProductions: number
}

export const InfoDisplay = ({ producedAtTimestamp, liters, totalProductions }: Props) => {
  const theme = useAppTheme()
  const navigation = useNavigation()

  return (
    <TouchableRipple
      style={styles.listItemRipple}
      onPress={() =>
        navigation.navigate('DailyProductionDetailsView', {
          productionTimestamp: producedAtTimestamp,
          totalLiters: liters
        })
      }
    >
      <>
        <Text variant='titleMedium'>{formatNumberWithSpaces(liters.toFixed(3))} L.</Text>
        <Text
          variant='labelSmall'
          style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
        >
          {totalProductions} {totalProductions === 1 ? 'producción' : 'producciones'}
        </Text>
      </>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  listItemRipple: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  }
})
