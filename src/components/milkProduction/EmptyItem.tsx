import { View } from "react-native"
import { Icon, Text } from "react-native-paper"

export const EmptyItem = () => {
  return (
    <View style={{flex:1, marginTop:80,justifyContent:"center", alignItems:"center"}}>
        <Icon size={48} source={"cup-off-outline"}/>
        <Text style={{marginTop:20}} variant="headlineSmall">No hay datos por mostrar</Text>
    </View>
  )
}
