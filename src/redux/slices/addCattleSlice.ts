import { CattleStatus, ProductionType } from '@/database/models/Cattle';
import { MatterProportion } from '@/database/models/Diet';
import { Cattle, Diet, DietFeed, Genealogy, MedicationSchedule } from '@/interfaces/cattleInterfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CattleInfoFields extends
	Omit<Cattle, 'cattleId' | 'isActive' | 'isArchived' | 'isSold' | 'dietId'> {
	motherId?: string
}
export interface CattleState {
	cattle: CattleInfoFields
	diet: Diet;
	dietFeeds: DietFeed[];
	medicationSchedules: MedicationSchedule[];
}

const initialState: CattleState = {
	cattle: {
		name: '',
		weight: undefined as any,
		bornAt: new Date(),
		tagId: '',
		tagCattleNumber: '',
		admittedAt: new Date(),
		cattleStatus: '' as CattleStatus,
		productionType: '' as ProductionType,
		quarantineDaysLeft: 0,
		pregnantAt: undefined,
		motherId: '',
	},

	diet: {
		dietId: '0',
		waterAmount: 0,
		matterAmount: 0,
		percentage: 0,
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
		saveDietFeed: (state, action: PayloadAction<{ dietFeed: DietFeed }>) => {
			state.dietFeeds.push(action.payload.dietFeed)
		},
		modifyFeedDiet: (state, action: PayloadAction<{ dietFeed: DietFeed }>) => {
			const index = state.dietFeeds.findIndex((dietFeed) => dietFeed.dietFeedId === action.payload.dietFeed.dietFeedId)
			state.dietFeeds[index] = action.payload.dietFeed
		},
		deleteDietFeed: (state, action: PayloadAction<{ dietFeedId: string }>) => {
			state.dietFeeds = state.dietFeeds.filter((dietFeed) => dietFeed.dietFeedId !== action.payload.dietFeedId)
		},
		saveMedicationSchedule: (state, action: PayloadAction<{ medicationSchedule: MedicationSchedule }>) => {
			state.medicationSchedules.push(action.payload.medicationSchedule)
		},
		modifyMedicationSchedule: (state, action: PayloadAction<{ medicationSchedule: MedicationSchedule }>) => {
			const index = state.medicationSchedules.findIndex((medicationSchedule) => medicationSchedule.medicationScheduleId === action.payload.medicationSchedule.medicationScheduleId)
			state.medicationSchedules[index] = action.payload.medicationSchedule
		},
		deleteMedicationSchedule: (state, action: PayloadAction<{ medicationScheduleId: string }>) => {
			state.medicationSchedules = state.medicationSchedules.filter((medicationSchedule) => medicationSchedule.medicationScheduleId !== action.payload.medicationScheduleId)
		},
		setDiet: (state, action: PayloadAction<{ diet: Diet }>) => {
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
