import useNumberFormat from '@/hooks/useNumberFormat'
import useAppTheme from '@/theme'
import { Text } from 'react-native-paper'

const EarningsDifference = ({ difference }: { difference: number }) => {
  const theme = useAppTheme()

  return (
    difference !== 0 && (
      <Text
        variant='labelSmall'
        style={{ color: difference < 0 ? theme.colors.error : theme.colors.success }}
      >
        {`${difference > 0 ? '+' : '-'}$${useNumberFormat(Math.abs(difference).toFixed(2))}`}
      </Text>
    )
  )
}

export default EarningsDifference
