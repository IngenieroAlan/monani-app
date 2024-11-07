import React from 'react'
import { CattleGeneologyDetails } from '../Components/CattleGeneologyDetails'
import { useAppSelector } from '@/hooks/useRedux';

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
