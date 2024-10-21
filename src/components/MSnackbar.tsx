import { hide } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { Snackbar, SnackbarProps } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

type Props = Omit<SnackbarProps, 'visible' | 'onDismiss'> & Partial<Pick<SnackbarProps, 'visible' | 'onDismiss'>>

const MSnackbar = (props: Props & { id: string }) => {
  const dispatch = useDispatch()
  const storeVisible = useSelector((state: RootState) => state.uiVisibility[props.id])

  return (
    <Snackbar
      visible={props.visible ? props.visible : storeVisible}
      onDismiss={() => (props.onDismiss ? props.onDismiss() : dispatch(hide(props.id)))}
      duration={3000}
      style={{ margin: 0 }}
      wrapperStyle={{ position: 'relative' }}
      {...props}
    >
      {props.children}
    </Snackbar>
  )
}

export default MSnackbar
