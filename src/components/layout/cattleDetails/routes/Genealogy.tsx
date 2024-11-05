import GenealogyList from "@/components/genealogyRoute/GenealogyList";
import Cattle from "@/database/models/Cattle";
import { useAppSelector } from "@/hooks/useRedux";
import { useEffect, useState } from "react";
import { View } from "react-native";

export const GenealogyRoute = () => {
  const { cattleInfo } = useAppSelector(state => state.cattles);
  const [offspring, setOffspring] = useState<Cattle[] | undefined>([]);
  useEffect(() => {
    async function getOffspring() {
      const offspring = (await cattleInfo?.offsprings?.fetch())
      setOffspring(offspring);
    }
    if (cattleInfo) getOffspring();
  }, [cattleInfo])
  return (<>
    <View style={{ flex: 1 }}>
      <GenealogyList offspring={offspring} />
    </View>
  </>)
}