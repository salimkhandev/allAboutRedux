Learning Redux (Next.js + RTK + RTK Query)

**A small Next.js app showing the basics of Redux Toolkit, createAsyncThunk, and RTK Query with a local JSON Server.**

Quick start
- Install: `npm i`
- Run API + App together: `npm run dev:full`
  - App: `http://localhost:3000`
  - API: `http://localhost:3001`

Scripts
- `npm run dev` – Next.js dev server
- `npm run json-server` – JSON Server (uses `db.json`)
- `npm run dev:full` – run both (via concurrently)

Tech
- Next.js App Router
- Redux Toolkit (`@reduxjs/toolkit`) + React Redux
- RTK Query (data fetching)
- JSON Server (mock REST API)

Folders
- `redux/store.js` – sets up store and middleware
- `redux/usersSlice.js` – slice + `createAsyncThunk`
- `redux/counterSlice.js` – basic slice reducers/actions
- `redux/postsApi.js` – RTK Query API (queries, mutations, optimistic updates)
- `app/` – pages/components
- `db.json` – users, posts, comments data

Redux Toolkit basics
- Create a slice with state + reducers
- Export actions from slice (auto-generated)
- Add the slice reducer to the store

Example (slice)
```js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
  },
})
export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
```

Async with createAsyncThunk
- Use for imperative async flows
- Handles pending/fulfilled/rejected

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const res = await fetch('http://localhost:3001/users')
  return await res.json()
})

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading' })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message || 'Error'
      })
  }
})
export default usersSlice.reducer
```

RTK Query (posts)
- Declarative endpoints (queries + mutations)
- Auto hooks: `useGetPostsQuery`, `useCreatePostMutation`, etc.
- Optimistic updates for create/update/delete

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => 'posts' }),
    createPost: builder.mutation({
      query: (body) => ({ url: 'posts', method: 'POST', body }),
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        const tempId = Math.random().toString(36).slice(2)
        const patch = dispatch(postsApi.util.updateQueryData('getPosts', undefined, d => {
          d.unshift({ id: tempId, ...newPost })
        }))
        try {
          const { data } = await queryFulfilled
          dispatch(postsApi.util.updateQueryData('getPosts', undefined, d => {
            const i = d.findIndex(p => p.id === tempId)
            if (i !== -1) d[i] = data
          }))
        } catch { patch.undo() }
      }
    }),
  })
})
```

Hooks usage
```js
const { data: posts = [], isLoading } = useGetPostsQuery()
const [createPost] = useCreatePostMutation()
```

Caching & freshness
- In this project, tag invalidation is off; we use optimistic updates
- If you need auto-refresh, enable tags or `refetchOnFocus/refetchOnReconnect`

JSON Server
- Base URL: `http://localhost:3001`
- Endpoints: `/users`, `/posts`, `/comments`

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# allAboutRedux
