import Medication from '@/database/models/Medication'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MedicationsState = {
  records: Medication[]
  selectedMedication?: Medication
}

const initialState: MedicationsState = {
  records: [],
  selectedMedication: undefined
}

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    setMedications: (state, action: PayloadAction<Medication[]>) => {
      state.records = action.payload
    },
    addMedication: (state, action: PayloadAction<Medication>) => {
      let index = state.records.findIndex((item) => {
        return item.name.toLowerCase().localeCompare(action.payload.name.toLowerCase()) > 0
      })

      index === -1 ? state.records.push(action.payload) : state.records.splice(index, 0, action.payload)
    },
    removeMedication: (state, action: PayloadAction<Medication>) => {
      const index = state.records.findIndex((item) => item.id === action.payload.id)
      state.records.splice(index, 1)
    },
    setSelectedMedication: (state, action: PayloadAction<Medication | undefined>) => {
      state.selectedMedication = action.payload
    }
  }
})

export const { setMedications, addMedication, removeMedication, setSelectedMedication } = medicationsSlice.actions

export default medicationsSlice.reducer
