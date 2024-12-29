import { memo, PropsWithChildren } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

type RecordsListProps = {
  filters?: JSX.Element
  emptyListComponent: JSX.Element
  isPending: boolean
  isListEmpty: boolean
} & PropsWithChildren

export const RecordsList = memo(({ children, filters, emptyListComponent, isPending, isListEmpty }: RecordsListProps) => {
  return (
    <>
      {filters && (
        <View>
          <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.filtersView}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filters}
          </ScrollView>
        </View>
      )}
      <View style={{ flex: 1 }}>
        {isPending && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size='large'
            animating
          />
        )}
        {isListEmpty ? (
          emptyListComponent
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, opacity: +!isPending }}>{children}</View>
          </View>
        )}
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  filtersView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
