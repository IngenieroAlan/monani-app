import { ArchiveReason } from "@/database/models/CattleArchive";
import { MatterProportion } from "@/database/models/Diet";
import { FeedProportion } from "@/database/models/DietFeed";
import { FeedType } from "@/database/models/Feed";
import { MedicationType } from "@/database/models/Medication";
import { CattleStatus, ProductionType } from "../database/models/Cattle";

interface ACCattle {
    cattleId: string;
    name?: string;
    tagId: string;
    tagCattleNumber: string;
    weight: number;
    quarantineDaysLeft?: number;
    admittedAt: Date;
    bornAt: Date;
    pregnantAt?: Date;
    productionType: ProductionType;
    cattleStatus: CattleStatus;
    isActive: boolean;
    isArchived: boolean;
    isSold: boolean;
    dietId: string;
}
interface ACCattleArchive {
    cattleId: string;
    notes?: string;
    archivedAt: Date;
    reason: ArchiveReason;
}
interface ACCattleSale {
    cattleId: string;
    soldBy: number;
    soldAt: Date;
}
interface ACDiet {
    dietId: string;
    waterAmount: number;
    matterAmount?: number;
    percentage?: number;
    matterProportion: MatterProportion;
    isConcentrateExcluded: boolean;
}
interface ACDietFeed {
    dietFeedId: string;
    dietId: string;
    feedId: string;
    feedAmount: number;
    percentage?: number;
    feedProportion: FeedProportion;
}
interface ACFeed {
    feedId: string;
    name: string;
    feedType: FeedType;
}
interface ACDietFeedItem extends ACDietFeed {
    FeedName: string;
}
interface ACGenealogy {
    motherId: string;
    offspringId: string;
}
interface ACMedication {
    medicationId: string;
    name: string;
    medicationType: MedicationType;
}
interface ACMedicationSchedule {
    medicationScheduleId: string;
    cattleId: string;
    medicationId: string;
    nextDoseAt: Date;
    dosesPerYear: number;
}
interface ACMedicationScheduleItem extends ACMedicationSchedule {
    medicationName: string;
    medicationType: MedicationType;
}
interface ACMilkReport {
    cattleId: string;
    milkProductionId: string;
    reportedAt: Date;
    liters: number;
}
interface ACWeightReport {
    cattleId: string;
    weight: number;
    weightDifference: number;
    daysPassed: number;
    avgDailyDifference: number;
    weighedAt: Date;
}

export type {
    ACCattle,
    ACCattleArchive,
    ACCattleSale,
    ACDiet,
    ACDietFeed,
    ACFeed,
    ACDietFeedItem,
    ACGenealogy,
    ACMedication,
    ACMedicationSchedule,
    ACMedicationScheduleItem,
    ACMilkReport,
    ACWeightReport
}