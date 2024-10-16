import { ArchiveReason } from "@/database/models/CattleArchive";
import { MatterProportion } from "@/database/models/Diet";
import { FeedProportion } from "@/database/models/DietFeed";
import { FeedType } from "@/database/models/Feed";
import { MedicationType } from "@/database/models/Medication";
import { CattleStatus, ProductionType } from "../database/models/Cattle";

interface Cattle {
    cattleId: string;
    name: string | undefined;
    tagId: string;
    tagCattleNumber: string;
    weight: number;
    quarantineDaysLeft: number | undefined;
    admittedAt: Date;
    bornAt: Date;
    pregnantAt: Date | undefined;
    productionType: ProductionType;
    cattleStatus: CattleStatus;
    isActive: boolean;
    isArchived: boolean;
    isSold: boolean;
    dietId: string;
}
interface CattleArchive {
    cattleId: string;
    notes: string | undefined;
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
    matterAmount: number | undefined;
    percentage: number | undefined;
    matterProportion: MatterProportion;
    isConcentrateExcluded: boolean;
}
interface DietFeed {
    dietId: string;
    feedId: string;
    feedAmount: number;
    percentage: number | undefined;
    feedProportion: FeedProportion;
}
interface Feed {
    feedId: string;
    name: string;
    feedType: FeedType;
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
    cattleId: string;
    medicationId: string;
    nextDoseAt: Date;
    dosesPerYear: number;
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
    Genealogy,
    Medication,
    MedicationSchedule,
    MilkReport,
    WeightReport
}