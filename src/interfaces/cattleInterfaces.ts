import { CattleStatus, ProductionType } from "../database/models/Cattle";

export interface Cattle {
    name: string | undefined;
    tagId: string;
    tagCattleNumber: string;
    weight: number;
    quarantineDaysLeft: number;
    admittedAt: Date;
    bornAt: Date;
    pregnantAt: Date | undefined;
    productionType: ProductionType;
    cattleStatus: CattleStatus;
    isActive: boolean;
    isArchived: boolean;
    isSold: boolean;
}

interface Diet {
    cattleId: string;
    name: string;
    type: string;
    quantity: number;
}

interface DietFeed {
    dietId: string;
    feedId: string;
    feedAmount: number;
    percentage: string;
    feedProportion: string;
}

interface Genealogy {
    motherId: string;
    offSpringId: string;
}

interface MedicationSchedule {
    cattleId: string;
    medicationId: string;
    administeredAt: Date;
    dose: number;
    frequency: number;
}

interface WeightReport {
    cattleId: string;
    weight: number;
    weightDifference: number;
    daysPassed: number;
    avgDailyDifference: number;
    weighedAt: Date;
}

interface MilkReport {
    cattleId: string;
    milkProductionId: string;
    liters: number;
    reportedAt: Date;
}

interface CattleSale {
    cattleId: string;
    soldBy: number;
    soldAt: Date;
}

interface CattleArchive {
    cattleId: string;
    archivedBy: number;
    archivedAt: Date;
}