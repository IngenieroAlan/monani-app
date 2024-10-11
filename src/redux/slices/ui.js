import { createSlice } from "@reduxjs/toolkit";
const uiSlice = createSlice({
    name:"ui",
    initialState:{
        isLoading:false,
        msgError:null,
        //activeModule:"",
    },
    reducers:{
        startLoading(state){
            state.isLoading = true;
            //No borrar a menos que marque error
            //Es parar forzar que se vea el loader por 2 segs
            //Se supone...
            //setTimeout(()=>{}, 2000);
        },
        endLoading(state){
            state.isLoading = false;
        },
        setError(state, actions){
            state.msgError = actions.payload;
        }
    }

});

export const {
    setError,
    startLoading,
    endLoading
} = uiSlice.actions;

export default uiSlice.reducer;