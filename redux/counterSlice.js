import { createSlice } from '@reduxjs/toolkit'
const initialState = { count: 0 }
const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => { state.count += 1 },
        decrement: (state) => { state.count -= 1 },
        addByAmount: (state, action) => { 
            
            state.count += action.payload 
            console.log({action,count: state.count})
        }
    }
})
export const { increment, decrement, addByAmount } = counterSlice.actions
export default counterSlice.reducer