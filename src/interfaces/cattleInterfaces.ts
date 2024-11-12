import { MatterProportion } from "@/database/models/Diet";
import { FeedProportion } from "@/database/models/DietFeed";
import Feed, { FeedType } from "@/database/models/Feed";
import Medication, { MedicationType } from "@/database/models/Medication";
import { CattleStatus, ProductionType } from "../database/models/Cattle";

interface ACCattle {
    cattleId: string;
    name?: string;
    tagId: string;
    tagCattleNumber: string;
    weight: number;
    quarantineDaysLeft?: number;
    admittedAt: Date | undefined;
    bornAt: Date | undefined;
    pregnantAt?: Date;
    productionType: ProductionType;
    cattleStatus: CattleStatus;
    isActive: boolean;
    isArchived: boolean;
    isSold: boolean;
    dietId: string;
}
interface ACDiet {
    dietId: string;
    waterAmount: number | undefined;
    matterAmount?: number;
    percentage?: number;
    matterProportion: MatterProportion;
    isConcentrateExcluded: boolean;
}
interface ACDietFeed {
    dietFeedId: string;
    dietId: string;
    feed: Feed
    feedAmount: number;
    percentage?: number;
    feedProportion: FeedProportion;
}
interface ACFeed {
    feedId: string;
    name: string;
    feedType: FeedType;
}
interface ACMedication {
    medicationId: string;
    name: string;
    medicationType: MedicationType;
}
interface ACMedicationSchedule {
    medicationScheduleId: string;
    cattleId: string;
    medication: Medication;
    nextDoseAt: Date;
    dosesPerYear: number;
}

export type {
  ACCattle,
  ACDiet,
  ACDietFeed,
  ACFeed,
  ACMedication,
  ACMedicationSchedule,
};
