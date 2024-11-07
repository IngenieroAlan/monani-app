import { useAppSelector } from '@/hooks/useRedux';
import { CattleMedicationsDetails } from '../Components/CattleMedicationDetails';

export const MedicationRoute = () => {
    const { cattleInfo } = useAppSelector(state => state.cattles);
    return (
        <>
            {
                cattleInfo && (<CattleMedicationsDetails cattle={cattleInfo} />)
            }
        </>
    );
};
