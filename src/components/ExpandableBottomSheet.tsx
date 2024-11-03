import useAppTheme from '@/theme'
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'

const ExpandableBottomSheet = (props: BottomSheetProps) => {
  const theme = useAppTheme()

  const [initialSnapPoint, setInitialSnapPoint] = useState(1)

  const snapPoints = useMemo(() => [initialSnapPoint, '100%'], [initialSnapPoint])

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setInitialSnapPoint(e.nativeEvent.layout.height)
  }, [])

  return (
    <>
      <View
        onLayout={handleLayout}
        style={{ flex: 1 }}
      />
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
    </>
  )
}

export default ExpandableBottomSheet
