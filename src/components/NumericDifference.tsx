import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { Text, TextProps } from 'react-native-paper'

type NumericDifferenceProps = {
  difference: number
  prefix?: string
  suffix?: string
} & Omit<TextProps<never>, 'children'>

const NumericDifference = (props: NumericDifferenceProps) => {
  const theme = useAppTheme()
  const { difference, prefix, suffix } = props

  return (
    difference !== 0 && (
      <Text
        variant='labelSmall'
        {...props}
        style={[props.style, { color: difference < 0 ? theme.colors.error : theme.colors.success }]}
      >
        {difference > 0 ? '+' : '-'}
        {prefix}
        {formatNumberWithSpaces(Math.abs(difference).toFixed(2))}
        {suffix}
      </Text>
    )
  )
}

export default NumericDifference
