import GenealogyList from "@/components/genealogyRoute/GenealogyList";
import { SetMother } from "@/components/genealogyRoute/SetMother";
import Cattle from "@/database/models/Cattle";
import { TableName } from "@/database/schema";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const observeCattle = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
    cattle,
    mother: cattle.mother.observe()
  }))
  

export const CattleGeneologyDetails = observeCattle(({ cattle, mother }: { cattle: Cattle, mother: Cattle[] }) => {
    const theme = useTheme();
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