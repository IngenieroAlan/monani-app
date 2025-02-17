import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'

type Props = {
  milkProduction: DailyMilkProduction
  nextMilkProduction: DailyMilkProduction | undefined
}

export const InfoDisplay = ({ milkProduction, nextMilkProduction }: Props) => {
  const theme = useAppTheme()
  const navigation = useNavigation()

  return (
    <TouchableRipple
      style={styles.listItemRipple}
      onPress={() => {}
      }
    >
      <>
        <Text variant='titleMedium'>{formatNumberWithSpaces(milkProduction.liters.toFixed(3))} L.</Text>
        <Text
          variant='labelSmall'
          style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
        >
          {milkProduction.totalProductions} {milkProduction.totalProductions === 1 ? 'producción' : 'producciones'}
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
