import Cattle from "@/database/models/Cattle"
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import { memo, useMemo, useRef } from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"
import MBottomSheet from "../MBottomSheet"

type BottomSheetProps = {
  cattleBottomSheet: number
  setCattleBottomSheet: (n: number) => void
  cattle: Cattle
}

const CattleDetailsBottomSheet = ({ cattleBottomSheet, setCattleBottomSheet, cattle }: BottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={cattleBottomSheet}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={() => setCattleBottomSheet(-1)}
    >
      <BottomSheetView>
        <Text variant='titleMedium' style={{ marginBottom: 5 }}>
          {cattle.name ? `No. ${cattle.tagId}: ${cattle.name}` : `No. ${cattle.tagId}`}
        </Text>
        
      </BottomSheetView>
    </BottomSheet>
  )
}
export default CattleDetailsBottomSheet