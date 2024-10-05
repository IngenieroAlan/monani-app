import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { Text } from 'react-native-paper'
import mainStyles from '../../styles/main'

export const NotificationsView = () => {
  return (
    <SafeAreaView style={mainStyles.container}>
      <View style={mainStyles.container}>
        <Text>NotificationsView</Text>
      </View>
    </SafeAreaView>
  )
}
