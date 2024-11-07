import database from "@/database";
import Cattle, { CattleStatus, ProductionType } from "@/database/models/Cattle";
import Diet, { MatterProportion } from "@/database/models/Diet";
import DietFeed, { FeedProportion } from "@/database/models/DietFeed";
import Feed from "@/database/models/Feed";
import Genealogy from "@/database/models/Genealogy";
import Medication from "@/database/models/Medication";
import MedicationSchedule from "@/database/models/MedicationSchedule";
import { TableName } from "@/database/schema";
import { addDays } from "date-fns";

type CattleFields = {
  name?: string;
  tagId: string;
  tagCattleNumber: string;
  admittedAt: Date;
  bornAt: Date;
  pregnantAt?: Date;
  weight: number;
  quarantineDays?: number;
  productionType: ProductionType;
  cattleStatus: CattleStatus;
  motherId?: string;
};

type DietFields = {
  waterAmount: number;
  matterAmount?: number;
  percentage?: number;
  matterProportion: MatterProportion;
  isConcentrateExcluded: boolean;
};

export type DietFeedFields = {
  feed: Feed;
  feedAmount: number;
  percentage?: number;
  feedProportion: FeedProportion;
};

export type MedicationScheduleFields = {
  medication: Medication;
  nextDoseAt: Date;
  dosesPerYear: number;
};

export const createCattle = async (
  cattleData: CattleFields,
  dietData: DietFields,
  dietFeedData: DietFeedFields[],
  medicationScheduleData: MedicationScheduleFields[]
) => {
  const createdCattle = await database.write(async () => {
    const diet = await database.collections
      .get<Diet>(TableName.DIETS)
      .create((record) => {
        record.waterAmount = dietData.waterAmount;
        record.matterAmount = dietData.matterAmount;
        record.percentage = dietData.percentage;
        record.matterProportion = dietData.matterProportion;
        record.isConcentrateExcluded = dietData.isConcentrateExcluded;
      });
    const cattle = await database.collections
      .get<Cattle>(TableName.CATTLE)
      .create((record) => {
        record.diet.set(diet);

        record.name = cattleData.name;
        record.tagId = cattleData.tagId;
        record.tagCattleNumber = cattleData.tagCattleNumber;
        record.admittedAt = cattleData.admittedAt;
        record.bornAt = cattleData.bornAt;
        record.pregnantAt = cattleData.pregnantAt;
        record.weight = cattleData.weight;
        record.quarantineEndsAt = cattleData.quarantineDays
          ? addDays(new Date(), cattleData.quarantineDays)
          : undefined;
        record.productionType = cattleData.productionType;
        record.cattleStatus = cattleData.cattleStatus;
        record.isActive = true;
        record.isArchived = false;
        record.isSold = false;
      });

    let preparedGenealogyRecord: Genealogy | null = null;

    if (cattleData.motherId) {
      preparedGenealogyRecord = database.collections
        .get<Genealogy>(TableName.GENEALOGY)
        .prepareCreate((record) => {
          record.mother.id = cattleData.motherId!;
          record.offspring.id = cattle.id;
        });
    }

    await database.batch(
      ...dietFeedData.map((dietFeed) => {
        return database.collections
          .get<DietFeed>(TableName.DIET_FEED)
          .prepareCreate((record) => {
            record.diet.set(diet);
            record.feed.set(dietFeed.feed);

            record.feedAmount = dietFeed.feedAmount;
            record.percentage = dietFeed.percentage;
            record.feedProportion = dietFeed.feedProportion;
          });
      }),
      ...medicationScheduleData.map((medicationSchedule) => {
        return database.collections
          .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
          .prepareCreate((record) => {
            record.cattle.set(cattle);
            record.medication.set(medicationSchedule.medication);

            record.nextDoseAt = medicationSchedule.nextDoseAt;
            record.dosesPerYear = medicationSchedule.dosesPerYear;
          });
      }),
      preparedGenealogyRecord
    );
  });

  return createdCattle;
};
