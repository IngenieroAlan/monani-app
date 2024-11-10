import { close } from '@/redux/slices/bottomSheetSlice'
import BottomSheet, { BottomSheetBackdrop, BottomSheetProps } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { forwardRef, Ref, useCallback } from 'react'
import { Portal, useTheme } from 'react-native-paper'
import { useDispatch } from 'react-redux'

const MBottomSheet = (props: BottomSheetProps & { id?: string }, ref?: Ref<BottomSheet>) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const backdrop = useCallback((props: BottomSheetDefaultBackdropProps) => {
    return (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    )
  }, [])

  return (
    <Portal>
      <BottomSheet
        ref={ref}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level1 }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.outline }}
        handleStyle={{ paddingVertical: 22 }}
        backdropComponent={backdrop}
        enableDynamicSizing={true}
        enablePanDownToClose={true}
        onClose={() => {
          if (!props.id) return

          dispatch(close(props.id))
        }}
        {...props}
      >
        {props.children}
      </BottomSheet>
    </Portal>
  )
}

export default forwardRef(MBottomSheet)
