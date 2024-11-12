import Medication from '@/database/models/Medication'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MedicationsState = {
  selectedMedication?: Medication
}

const initialState: MedicationsState = {
  selectedMedication: undefined
}

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    setSelectedMedication: (state, action: PayloadAction<Medication | undefined>) => {
      state.selectedMedication = action.payload
    }
  }
})

export const { setSelectedMedication } = medicationsSlice.actions

export default medicationsSlice.reducer
