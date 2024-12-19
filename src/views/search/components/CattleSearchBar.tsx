import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import { useNavigation } from '@react-navigation/native'
import { Icon, Searchbar } from 'react-native-paper'

const CattleSearchBar = () => {
  const navigation = useNavigation()
  const tagId = useCattleFilters('tagId')
  const setTagId = useCattleFilters('setTagId')

  return (
    <Searchbar
      keyboardType='numeric'
      placeholder='Buscar no. de identificación'
      value={tagId}
      onChangeText={(text) => setTagId(text)}
      mode='view'
      icon={() => (
        <Icon
          size={24}
          source='arrow-left'
        />
      )}
      onIconPress={navigation.goBack}
    />
  )
}

export default CattleSearchBar
