import Cattle from '@/database/models/Cattle'
import { useAppSelector } from '@/hooks/useRedux'
import { RootStackParamList } from '@/navigation/types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import SearchGenealogy from './SearchGenealogy'

const SearchMother = ({ route }: NativeStackScreenProps<RootStackParamList, 'SearchMotherView'>) => {
  const navigation = useNavigation()
  const [selectedMother, setSelectedMother] = useState<Cattle | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editar = route.params?.editar

  const { cattleInfo } = useAppSelector(state => state.cattles);

  async function setMother() {
    setIsSubmitting(true)
    if (!cattleInfo || !selectedMother) {
      setIsSubmitting(false)
      return
    }
    if (editar) await cattleInfo.removeMother()
    await cattleInfo.setMother(selectedMother)
    setIsSubmitting(false)
    navigation.goBack()
  }

  return (
    <SearchGenealogy action={setMother} isSubmitting={isSubmitting} setSelectedCattle={setSelectedMother} selectedCattle={selectedMother} />
  )
}

export default SearchMother
