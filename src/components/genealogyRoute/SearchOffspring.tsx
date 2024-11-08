import Cattle from '@/database/models/Cattle'
import { useAppSelector } from '@/hooks/useRedux'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import SearchGenealogy from './SearchGenealogy'

const SearchOffspring = () => {
  const navigation = useNavigation()
  const [selectedOffspring, setSelectedOffspring] = useState<Cattle | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { cattleInfo } = useAppSelector(state => state.cattles);
  const [offsprings, setOffsprings] = useState<Cattle[]>([])

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
    if (!cattleInfo || !selectedOffspring) {
      setIsSubmitting(false)
      return
    }
    await cattleInfo.setOffsprings([...offsprings, selectedOffspring])
    setIsSubmitting(false)
    navigation.goBack()
  }

  return (
    <SearchGenealogy action={setOffspring} isSubmitting={isSubmitting} setSelectedCattle={setSelectedOffspring} selectedCattle={selectedOffspring} />
  )
}

export default SearchOffspring
