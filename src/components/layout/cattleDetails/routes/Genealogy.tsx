import CattleDetailsBottomSheet from "@/components/layout/cattleDetails/Components/genealogy/CattleDetailsBottomSheet";
import GenealogyList from "@/components/layout/cattleDetails/Components/genealogy/GenealogyList";
import GenealogySnackbarContainer from "@/components/layout/cattleDetails/Components/genealogy/GenealogySnackbarContainer";
import { SetMother } from "@/components/layout/cattleDetails/Components/genealogy/SetMother";
import { SurfaceContainer } from '@/components/SurfaceContainer';
import Cattle from "@/database/models/Cattle";
import { TableName } from "@/database/schema";
import { useAppSelector } from '@/hooks/useRedux';
import { withObservables } from "@nozbe/watermelondb/react";
import React, { useState } from 'react';

export const GenealogyRoute = () => {
  const { cattleInfo } = useAppSelector(state => state.cattles);
  return (
    <>
      {
        cattleInfo && <CattleGeneologyDetails cattle={cattleInfo} />
      }
    </>
  )
}

const observeCattle = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const CattleGeneologyDetails = observeCattle(({ cattle }: { cattle: Cattle }) => {
  const [cattleBottomSheet, setCattleBottomSheet] = useState(-1)
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null)

  const onSelectedCattle = (cattle: Cattle) => {
    setSelectedCattle(cattle)
    setCattleBottomSheet(2)
  }

  return (<>
    <SurfaceContainer>
      <SetMother cattle={cattle} onSelectedCattle={onSelectedCattle} />
      <GenealogyList cattle={cattle} onSelectedCattle={onSelectedCattle} />
    </SurfaceContainer>
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
