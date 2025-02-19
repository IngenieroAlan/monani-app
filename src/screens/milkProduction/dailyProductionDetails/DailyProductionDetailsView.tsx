import { SurfaceContainer } from '@/components/SurfaceContainer'
import { MainStackParamList } from '@/navigation/types'
import { formatDateRelativeToYear } from '@/utils/helpers'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { View } from 'react-native'
import { Appbar, Divider } from 'react-native-paper'
import { DailyInfoCard } from './components/DailyInfoCard'

type ScreenProps = NativeStackScreenProps<MainStackParamList, 'DailyProductionDetailsView'>

export const DailyProductionDetailsView = ({ route, navigation }: ScreenProps) => {
  const { productionTimestamp, totalLiters } = route.params

  return (
    <SurfaceContainer>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={formatDateRelativeToYear(productionTimestamp)} />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <DailyInfoCard
            totalLiters={totalLiters}
            productionTimestamp={productionTimestamp}
          />
        </View>
        <Divider />
      </View>
    </SurfaceContainer>
  )
}
