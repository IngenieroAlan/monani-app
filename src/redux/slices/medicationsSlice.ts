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
    }
  }
})

export const { setMedications, addMedication } = medicationsSlice.actions

export default medicationsSlice.reducer
