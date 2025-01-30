import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { Text, TextProps } from 'react-native-paper'

type NumericDifferenceProps = {
  difference: number
  prefix?: string
  suffix?: string
  fractionDigits?: number
} & Omit<TextProps<never>, 'children'>

const NumericDifference = ({ difference, prefix, suffix, fractionDigits, style, ...rest }: NumericDifferenceProps) => {
  const theme = useAppTheme()

  return (
    difference !== 0 && (
      <Text
        variant='labelSmall'
        {...rest}
        style={[style, { color: difference < 0 ? theme.colors.error : theme.colors.success }]}
      >
        {difference > 0 ? '+' : '-'}
        {prefix}
        {formatNumberWithSpaces(Math.abs(difference).toFixed(fractionDigits))}
        {suffix}
      </Text>
    )
  )
}

export default NumericDifference
