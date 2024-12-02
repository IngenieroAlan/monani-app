import useAppTheme from '@/theme'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const LitersSoldChip = () => {
  const theme = useAppTheme()

  return (
    <Text
      style={[
        styles.container,
        {
          borderRadius: theme.roundness,
          backgroundColor: theme.colors.successContainer,
          borderColor: theme.colors.outline
        }
      ]}
      variant='labelMedium'
    >
      Litros vendidos
    </Text>
  )
}

export default LitersSoldChip

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    textAlign: 'center'
  }
})
