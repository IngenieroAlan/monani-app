import GenealogyList from "@/components/genealogyRoute/GenealogyList";
import { SetMother } from "@/components/genealogyRoute/SetMother";
import Cattle from "@/database/models/Cattle";
import { useAppSelector } from "@/hooks/useRedux";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export const GenealogyRoute = () => {
  const theme = useTheme();
  const { cattleInfo } = useAppSelector(state => state.cattles);
  const [offspring, setOffspring] = useState<Cattle[] | undefined>([]);
  const [mother, setMother] = useState<Cattle | undefined>(undefined);
  useEffect(() => {
    async function getOffspring() {
      const offspring = (await cattleInfo?.offsprings?.fetch())
      setOffspring(offspring);
      const motherFetch = await cattleInfo?.mother?.fetch();
      const mother = motherFetch ? motherFetch[0] : undefined;
      setMother(mother);
    }
    if (cattleInfo) getOffspring();
  }, [cattleInfo])

  return (<>
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <SetMother mother={mother} />
      <GenealogyList offspring={offspring} />
    </View>
  </>)
}