import { ArchiveReason } from "@/database/models/CattleArchive";
import { MatterProportion } from "@/database/models/Diet";
import { FeedProportion } from "@/database/models/DietFeed";
import { FeedType } from "@/database/models/Feed";
import { MedicationType } from "@/database/models/Medication";
import { CattleStatus, ProductionType } from "../database/models/Cattle";

interface Cattle {
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
interface CattleArchive {
    cattleId: string;
    notes?: string;
    archivedAt: Date;
    reason: ArchiveReason;
}
interface CattleSale {
    cattleId: string;
    soldBy: number;
    soldAt: Date;
}
interface Diet {
    dietId: string;
    waterAmount: number;
    matterAmount?: number;
    percentage?: number;
    matterProportion: MatterProportion;
    isConcentrateExcluded: boolean;
}
interface DietFeed {
    dietFeedId: string;
    dietId: string;
    feedId: string;
    feedAmount: number;
    percentage?: number;
    feedProportion: FeedProportion;
}
interface Feed {
    feedId: string;
    name: string;
    feedType: FeedType;
}
interface DietFeedItem extends DietFeed {
    FeedName: string;
}
interface Genealogy {
    motherId: string;
    offspringId: string;
}
interface Medication {
    medicationId: string;
    name: string;
    medicationType: MedicationType;
}
interface MedicationSchedule {
    medicationScheduleId: string;
    cattleId: string;
    medicationId: string;
    nextDoseAt: Date;
    dosesPerYear: number;
}
interface MedicationScheduleItem extends MedicationSchedule {
    medicationName: string;
    medicationType: MedicationType;
}
interface MilkReport {
    cattleId: string;
    milkProductionId: string;
    reportedAt: Date;
    liters: number;
}
interface WeightReport {
    cattleId: string;
    weight: number;
    weightDifference: number;
    daysPassed: number;
    avgDailyDifference: number;
    weighedAt: Date;
}

export type {
    Cattle,
    CattleArchive,
    CattleSale,
    Diet,
    DietFeed,
    Feed,
    DietFeedItem,
    Genealogy,
    Medication,
    MedicationSchedule,
    MedicationScheduleItem,
    MilkReport,
    WeightReport
}