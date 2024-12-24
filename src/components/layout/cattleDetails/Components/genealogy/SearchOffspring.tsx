import Cattle from '@/database/models/Cattle'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { GenealogySnackbarId } from './GenealogySnackbarContainer'
import SearchGenealogyView from './SearchGenealogyView'

const SearchOffspring = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { cattleInfo } = useAppSelector((state) => state.cattles)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [offsprings, setOffsprings] = useState<Cattle[]>([])
  const [selectedOffspring, setSelectedOffspring] = useState<Cattle | undefined>(undefined)

  useEffect(() => {
    const fetch = async () => {
      if (cattleInfo) {
        setOffsprings(await cattleInfo.offsprings.fetch())
      }
    }
    fetch()
  }, [cattleInfo])

  async function setOffspring() {
    setIsSubmitting(true)
    if (!cattleInfo) {
      setIsSubmitting(false)
      return
    }
    await cattleInfo.setOffsprings([...offsprings])
    dispatch(show(GenealogySnackbarId.UPDATED_OFFSPRING))
    setIsSubmitting(false)
    navigation.goBack()
  }

  return (
    <SearchGenealogyView
      action={setOffspring}
      isSubmitting={isSubmitting}
      setSelectedCattle={setSelectedOffspring}
      selectedCattle={selectedOffspring}
      editOffspring={true}
      offsprings={offsprings}
      setOffsprings={setOffsprings}
    />
  )
}

export default SearchOffspring
