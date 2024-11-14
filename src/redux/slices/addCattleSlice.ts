import { CattleStatus, ProductionType } from '@/database/models/Cattle';
import { MatterProportion } from '@/database/models/Diet';
import { ACCattle, ACDiet, ACDietFeed, ACMedicationSchedule } from '@/interfaces/cattleInterfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CattleInfoFields extends
  Omit<ACCattle, 'cattleId' | 'isActive' | 'isArchived' | 'isSold' | 'dietId'> {
  motherId?: string
}
export interface CattleState {
  cattle: CattleInfoFields
  diet: ACDiet;
  dietFeeds: ACDietFeed[];
  medicationSchedules: ACMedicationSchedule[];
}

const initialState: CattleState = {
  cattle: {
    name: '',
    weight: undefined as any,
    bornAt: undefined,
    tagId: '',
    tagCattleNumber: '',
    admittedAt: undefined,
    cattleStatus: '' as CattleStatus,
    productionType: '' as ProductionType,
    quarantineDays: undefined,
    pregnantAt: undefined,
    motherId: '',
  },

  diet: {
    dietId: '0',
    waterAmount: undefined,
    matterAmount: undefined,
    percentage: undefined,
    matterProportion: '' as MatterProportion,
    isConcentrateExcluded: false,
  },

  dietFeeds: [],

  medicationSchedules: [],
}

const addCattleSlice = createSlice({
  name: 'addCattle',
  initialState,
  reducers: {
    reset: () => initialState,
    saveCattleInfo: (state, action: PayloadAction<{ cattle: CattleInfoFields }>) => {
      state.cattle = action.payload.cattle
    },
    saveDietFeed: (state, action: PayloadAction<{ dietFeed: ACDietFeed }>) => {
      // if feed is alredy in the list, do not add it
      if (state.dietFeeds.some((dietFeed) => dietFeed.feed.id === action.payload.dietFeed.feed.id)) {
        throw new Error('Este alimento ya es parte de la dieta.')
      }
      state.dietFeeds.push(action.payload.dietFeed)
    },
    modifyFeedDiet: (state, action: PayloadAction<{ dietFeed: ACDietFeed }>) => {
      const index = state.dietFeeds.findIndex((dietFeed) => dietFeed.dietFeedId === action.payload.dietFeed.dietFeedId)
      state.dietFeeds[index] = action.payload.dietFeed
    },
    deleteDietFeed: (state, action: PayloadAction<{ dietFeedId: string }>) => {
      state.dietFeeds = state.dietFeeds.filter((dietFeed) => dietFeed.dietFeedId !== action.payload.dietFeedId)
    },
    saveMedicationSchedule: (state, action: PayloadAction<{ medicationSchedule: ACMedicationSchedule }>) => {
      // if medication is alredy in the list, do not add it
      if (state.medicationSchedules.some((medicationSchedule) => medicationSchedule.medicationScheduleId === action.payload.medicationSchedule.medicationScheduleId)) {
        throw new Error(`Ya existe una programación para el medicamento ${action.payload.medicationSchedule.medication.name}.`)
      }
      state.medicationSchedules.push(action.payload.medicationSchedule)
    },
    modifyMedicationSchedule: (state, action: PayloadAction<{ medicationSchedule: ACMedicationSchedule }>) => {
      const index = state.medicationSchedules.findIndex((medicationSchedule) => medicationSchedule.medicationScheduleId === action.payload.medicationSchedule.medicationScheduleId)
      state.medicationSchedules[index] = action.payload.medicationSchedule
    },
    deleteMedicationSchedule: (state, action: PayloadAction<{ medicationScheduleId: string }>) => {
      state.medicationSchedules = state.medicationSchedules.filter((medicationSchedule) => medicationSchedule.medicationScheduleId !== action.payload.medicationScheduleId)
    },
    setDiet: (state, action: PayloadAction<{ diet: ACDiet }>) => {
      state.diet = action.payload.diet
    },
  }
})

export const {
  reset,
  saveCattleInfo,
  saveDietFeed,
  modifyFeedDiet,
  deleteDietFeed,
  saveMedicationSchedule,
  modifyMedicationSchedule,
  deleteMedicationSchedule,
  setDiet,
} = addCattleSlice.actions

export default addCattleSlice.reducer
