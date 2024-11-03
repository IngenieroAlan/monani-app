import useAppTheme from '@/theme'
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet'
import { useCallback, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'

const ExpandableBottomSheet = (props: BottomSheetProps) => {
  const theme = useAppTheme()

  const [snapPoints, setSnapPoints] = useState<(string | number)[]>([])

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setSnapPoints([e.nativeEvent.layout.height, '100%'])
  }, [])

  return snapPoints.length === 0 ? (
    <View
      onLayout={handleLayout}
      style={{ flex: 1 }}
    />
  ) : (
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
