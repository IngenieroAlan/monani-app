import { CattleStatus, ProductionType } from '@/database/models/Cattle';
import { MatterProportion } from '@/database/models/Diet';
import { Cattle, Diet, DietFeed, Genealogy } from '@/interfaces/cattleInterfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CattleState {
	cattle: Cattle;
	genealogy: Genealogy;
	diet: Diet;
	dietFeeds: DietFeed[];
}

const initialState: CattleState = {
	cattle: {
		cattleId: '',
		name: '',
		weight: 500, // temporary value
		bornAt: new Date(),
		tagId: '',
		tagCattleNumber: '',
		admittedAt: new Date(),
		cattleStatus: '' as CattleStatus,
		productionType: '' as ProductionType,
		quarantineDaysLeft: 0,
		pregnantAt: undefined,
		isActive: false,
		isArchived: false,
		isSold: false,
		dietId: '',
	},

	genealogy: {
		motherId: '',
		offspringId: '',
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
}

const addCattleSlice = createSlice({
	name: 'addCattle',
	initialState,
	reducers: {
		reset: () => initialState,
		saveCattleInfo: (state, action: PayloadAction<{ cattle: Cattle; genealogy: Genealogy }>) => {
			state.cattle = action.payload.cattle
			state.genealogy = action.payload.genealogy
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
	}
})

export const { saveCattleInfo, saveDietFeed, modifyFeedDiet, deleteDietFeed, reset } = addCattleSlice.actions

export default addCattleSlice.reducer
