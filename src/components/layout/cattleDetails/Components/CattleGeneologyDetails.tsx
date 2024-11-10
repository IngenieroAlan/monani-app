import CattleDetailsBottomSheet from "@/components/genealogyRoute/CattleDetailsBottomSheet";
import GenealogyList from "@/components/genealogyRoute/GenealogyList";
import GenealogySnackbarContainer from "@/components/genealogyRoute/GenealogySnackbarContainer";
import { SetMother } from "@/components/genealogyRoute/SetMother";
import Cattle from "@/database/models/Cattle";
import { TableName } from "@/database/schema";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const observeCattle = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

export const CattleGeneologyDetails = observeCattle(({ cattle }: { cattle: Cattle }) => {
  const theme = useTheme();
  const [cattleBottomSheet, setCattleBottomSheet] = useState(-1)
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null)

  const onSelectedCattle = (cattle: Cattle) => {
    setSelectedCattle(cattle)
    setCattleBottomSheet(2)
  }

  return (<>
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <SetMother cattle={cattle} onSelectedCattle={onSelectedCattle} />
      <GenealogyList cattle={cattle} onSelectedCattle={onSelectedCattle} />
    </View>
    {selectedCattle && (
      <CattleDetailsBottomSheet
        cattleBottomSheet={cattleBottomSheet}
        setCattleBottomSheet={setCattleBottomSheet}
        cattle={selectedCattle!}
      />
    )}
    <GenealogySnackbarContainer />
  </>)
})