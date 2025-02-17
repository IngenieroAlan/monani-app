import useAppTheme from '@/theme'
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import { View } from 'react-native'

const ExpandableBottomSheet = (props: BottomSheetProps) => {
  const theme = useAppTheme()
  const [snapPoints, setSnapPoints] = useState<(string | number)[]>([])

  if (snapPoints.length === 0) {
    return (
      <View
        onLayout={(e) => setSnapPoints([e.nativeEvent.layout.height, '100%'])}
        style={{ flex: 1 }}
      />
    )
  }

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: theme.colors.surface, borderRadius: 0 }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.outline }}
      handleStyle={{ paddingVertical: 22 }}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      animateOnMount={false}
      {...props}
      snapPoints={snapPoints}
    >
      {props.children}
    </BottomSheet>
  )
}

export default ExpandableBottomSheet
