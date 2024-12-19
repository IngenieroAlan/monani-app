import { CattleFiltersProvider } from '@/contexts/CattleFiltersContext'
import { Portal, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import CattleList from '../../components/CattleList/CattleList'
import CattleSearchBar from './components/CattleSearchBar'
import SearchListItem from './components/SearchListItem'

const SearchCattleView = () => {
  const theme = useTheme()

  return (
    <CattleFiltersProvider>
      <Portal.Host>
        <SafeAreaView
          style={{
            backgroundColor: theme.colors.elevation.level3,
            flex: 1
          }}
        >
          <CattleSearchBar />
          <CattleList
            flashListProps={{
              estimatedItemSize: 78,
              keyboardShouldPersistTaps: 'handled',
              onEndReachedThreshold: 1.5,
            }}
            filters={
              <>
                <CattleList.StatusFilterChip />
                <CattleList.ProductionFilterChip />
                <CattleList.FlagFilterChip />
                <CattleList.QuarantineFilterChip />
              </>
            }
          >
            {({ item }) => <SearchListItem cattle={item} />}
          </CattleList>
        </SafeAreaView>
      </Portal.Host>
    </CattleFiltersProvider>
  )
}

export default SearchCattleView
