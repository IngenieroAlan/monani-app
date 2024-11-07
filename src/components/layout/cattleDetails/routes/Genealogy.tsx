import GenealogyList from "@/components/genealogyRoute/GenealogyList";
import { SetMother } from "@/components/genealogyRoute/SetMother";
import database from "@/database";
import Cattle from "@/database/models/Cattle";
import { useAppSelector } from "@/hooks/useRedux";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle,
  mother: cattle.mother.observe()
}))

export const GenealogyRoute = () => {
  const theme = useTheme();
  const { selectedCattle, cattles } = useAppSelector(state => state.cattles);
  const cattle = cattles.find(cow => cow.id === selectedCattle);

  const Genealogy = observeCattle(({ cattle, mother }: { cattle: Cattle, mother: Cattle[] }) => {
    const [offspring, setOffspring] = useState<Cattle[] | undefined>([]);
    useEffect(() => {
      async function getData() {
        const offspring = (await cattle.offsprings?.fetch())
        setOffspring(offspring);
      }
      getData();
    }, [cattle])

    return (<>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <SetMother cattle={cattle} mother={mother[0]} />
        <GenealogyList offspring={offspring} />
      </View>
    </>)
  })

  return cattle ? <Genealogy cattle={cattle} /> : null;
}