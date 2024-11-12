import DietSnackBarContainer from "@/components/dietFeedRoute/DietSnackBarContainer";
import { useAppSelector } from "@/hooks/useRedux";
import { CattleDietDetails } from "../Components/CattleDietDetails";

export const DietRoute = () => {
  const { cattleInfo } = useAppSelector(state => state.cattles);
  return (
    <>
      {cattleInfo && <CattleDietDetails cattle={cattleInfo} />}
      <DietSnackBarContainer />
    </>
  )
}


