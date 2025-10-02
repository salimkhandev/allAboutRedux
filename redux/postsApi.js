import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
  }),
  endpoints: (builder) => ({
    // Get all posts
    getPosts: builder.query({
      query: () => 'posts',
    }),
    // Create new post (optimistic add)
    createPost: builder.mutation({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        const tempId = Math.random().toString(36).slice(2)
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.unshift({ id: tempId, ...newPost })
          })
        )
        try {
          const { data: created } = await queryFulfilled
          // Replace temp item with server item (id from server)
          dispatch(
            postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
              const idx = draft.findIndex(p => p.id === tempId)
              if (idx !== -1) draft[idx] = created
            })
          )
        } catch {
          patchResult.undo()
        }
      },
    }),
    // Update post (optimistic edit)
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find(p => p.id === id)
            if (post) Object.assign(post, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    // Delete post (optimistic remove)
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            const idx = draft.findIndex(p => p.id === id)
            if (idx !== -1) draft.splice(idx, 1)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi
