import dayjs from 'dayjs'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

export const DateDisplay = ({ date }: { date: Date }) => {
  return (
    <View style={styles.dateContainer}>
      <Text variant='labelLarge'>{dayjs(date).format('DD')}</Text>
      <Text
        variant='labelSmall'
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {dayjs(date).format(`MMM.${dayjs().isSame(date, 'year') ? '' : ' YY'}`)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  dateContainer: {
    alignItems: 'center',
    paddingTop: 4,
    width: 52
  }
})
