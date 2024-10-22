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
    modifyMedication: (state, action: PayloadAction<{ oldName: string; new: Medication }>) => {
      const { oldName, new: newMedication } = action.payload
      const index = state.records.findIndex((item) => item.id === newMedication.id)
      const newName = newMedication.name.toLowerCase()

      if (oldName.toLowerCase() === newName) return

      state.records.splice(index, 1)
      let newIndex = -1

      if (newName.localeCompare(oldName) < 0) {
        newIndex = state.records.findIndex((item) => {
          return item.name.toLowerCase().localeCompare(newName) > 0
        })
      } else {
        newIndex = state.records.slice(index).findIndex((item) => {
          return item.name.toLowerCase().localeCompare(newName) > 0
        })

        if (newIndex !== -1) newIndex += index
      }

      newIndex === -1 ? state.records.push(newMedication) : state.records.splice(newIndex, 0, newMedication)
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

export const {
  setMedications,
  addMedication,
  modifyMedication,
  removeMedication,
  setSelectedMedication
} = medicationsSlice.actions

export default medicationsSlice.reducer
