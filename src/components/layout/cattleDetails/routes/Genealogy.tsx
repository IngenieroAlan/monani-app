import GenealogyList from "@/components/genealogyRoute/GenealogyList";
import { SetMother } from "@/components/genealogyRoute/SetMother";
import Cattle from "@/database/models/Cattle";
import { useAppSelector } from "@/hooks/useRedux";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

export const GenealogyRoute = () => {
  const theme = useTheme();
  const { selectedCattle, cattles } = useAppSelector(state => state.cattles);
  const [cattle, setCattle] = useState<Cattle | undefined>(undefined);

  useEffect(() => {
    if (selectedCattle) {
      const selected = cattles.find(cow => cow.id === selectedCattle);
      if (selected) {
        setCattle(selected);

      }
    }
  }, [selectedCattle, cattles])

  const Genealogy = observeCattle(({ cattle }: { cattle: Cattle }) => {
    const [offspring, setOffspring] = useState<Cattle[] | undefined>([]);
    const [mother, setMother] = useState<Cattle | undefined>(undefined);
    useEffect(() => {
      async function getData() {
        const offspring = (await cattle.offsprings?.fetch())
        setOffspring(offspring);
        try {
          const motherFetch = await cattle.mother.fetch();
          const mother = motherFetch ? motherFetch[0] : undefined;
          setMother(mother);
          console.log(motherFetch, mother?.tagId);
        } catch (error) {
          console.log(error);
        }
        
      }
      getData();
    }, [cattle])

    return (<>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <SetMother cattle={cattle} mother={mother} />
        <GenealogyList offspring={offspring} />
      </View>
    </>)
  })

  return cattle ? <Genealogy cattle={cattle} /> : null;
}