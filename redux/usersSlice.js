import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('http://localhost:3001/users')
    if (!response.ok) {
        throw new Error('Failed to fetch users')
    }
    const data = await response.json()
    return data
})

const initialState = {
    list: [],
    status: 'idle', 
    error: null
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.list = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error?.message || 'Unknown error'
            })
    }
})

export default usersSlice.reducer


