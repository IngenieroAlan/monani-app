import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { Text, TextProps } from 'react-native-paper'

type NumericDifferenceProps = {
  difference: number
} & Omit<TextProps<never>, 'children'>

const NumericDifference = (props: NumericDifferenceProps) => {
  const theme = useAppTheme()
  const { difference } = props

  return (
    difference !== 0 && (
      <Text
        variant='labelSmall'
        {...props}
        style={[props.style, { color: difference < 0 ? theme.colors.error : theme.colors.success }]}
      >
        {`${difference > 0 ? '+' : '-'}$${formatNumberWithSpaces(Math.abs(difference).toFixed(2))}`}
      </Text>
    )
  )
}

export default NumericDifference
