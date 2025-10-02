import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import { postsApi } from './postsApi'
import usersReducer from './usersSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        users: usersReducer,
        [postsApi.reducerPath]: postsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postsApi.middleware),
})
export default store    