import { useCallback, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

const useScrollFab = () => {
  const lastScrollPosition = useRef(0)
  const [isFabExtended, setIsFabExtended] = useState(true)
  const [isScrollAtTop, setIsScrollAtTop] = useState(false)

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition = Math.floor(e.nativeEvent.contentOffset.y) ?? 0

    if (currentScrollPosition > lastScrollPosition.current) {
      setIsFabExtended(false)
    } else if (currentScrollPosition < lastScrollPosition.current) {
      setIsFabExtended(true)
    }

    lastScrollPosition.current = currentScrollPosition
    setIsScrollAtTop(currentScrollPosition > 0)
  }, [])

  return {
    isFabExtended,
    isScrollAtTop,
    onScroll
  }
}

export default useScrollFab
