import Cattle from '@/database/models/Cattle'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { CattleStackParamList } from '@/navigation/types'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import { GenealogySnackbarId } from './GenealogySnackbarContainer'
import SearchGenealogyView from './SearchGenealogyView'

type ScreenProps = NativeStackScreenProps<CattleStackParamList, 'SearchMotherView'>

const SearchMother = ({ navigation, route }: ScreenProps) => {
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
