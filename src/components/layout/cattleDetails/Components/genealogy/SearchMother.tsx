import Cattle from '@/database/models/Cattle'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { MainStackParamList } from '@/navigation/types'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import { GenealogySnackbarId } from './GenealogySnackbarContainer'
import SearchGenealogyView from './SearchGenealogyView'

const SearchMother = ({ route }: NativeStackScreenProps<MainStackParamList, 'SearchMotherView'>) => {
  const navigation = useNavigation()
  const [selectedMother, setSelectedMother] = useState<Cattle | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const edit = route.params?.edit
  const dispatch = useAppDispatch()

  const { cattleInfo } = useAppSelector(state => state.cattles);

  async function setMother() {
    setIsSubmitting(true)
    if (!cattleInfo || !selectedMother) {
      setIsSubmitting(false)
      return
    }
    edit && await cattleInfo.removeMother()
    await cattleInfo.setMother(selectedMother)
    edit ? dispatch(show(GenealogySnackbarId.UPDATED_MOTHER)) :
      dispatch(show(GenealogySnackbarId.ASSIGNED_MOTHER))
    setIsSubmitting(false)
    navigation.goBack()
  }

  return (
    <SearchGenealogyView
      action={setMother}
      isSubmitting={isSubmitting}
      setSelectedCattle={setSelectedMother}
      selectedCattle={selectedMother}
    />
  )
}

export default SearchMother
