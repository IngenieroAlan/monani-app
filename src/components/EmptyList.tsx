import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'

type EmptyListProps = {
  icon: string
  text: string
}

const EmptyList = ({ icon, text }: EmptyListProps) => {
  return (
    <View style={styles.view}>
      <Icon
        size={40}
        source={icon}
      />
      <Text
        style={{ textAlign: 'center' }}
        variant='titleSmall'
      >
        {text}
      </Text>
    </View>
  )
}

export default EmptyList

const styles = StyleSheet.create({
  view: {
    margin: 'auto',
    alignItems: 'center',
    padding: 16,
    gap: 4
  }
})
