'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation
} from '../../redux/postsApi'

export default function PostsPage() {
  const [newPost, setNewPost] = useState({ title: '', body: '' })
  const [editingPost, setEditingPost] = useState(null)
  
  // RTK Query hooks
  const { data: posts = [], error, isLoading } = useGetPostsQuery()
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (newPost.title && newPost.body) {
      try {
        await createPost({
          title: newPost.title,
          body: newPost.body,
          userId: 1
        }).unwrap()
        setNewPost({ title: '', body: '' })
      } catch (err) {
        console.error('Failed to create post:', err)
      }
    }
  }

  const handleUpdatePost = async (e) => {
    e.preventDefault()
    if (editingPost) {
      try {
        await updatePost({
          id: editingPost.id,
          title: editingPost.title,
          body: editingPost.body,
          userId: editingPost.userId
        }).unwrap()
        setEditingPost(null)
      } catch (err) {
        console.error('Failed to update post:', err)
      }
    }
  }

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id).unwrap()
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-semibold">Error loading posts</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    </div>
  )

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📝 Posts <span className="text-lg font-bold text-blue-500">RTK Query</span></h1>
        <Link 
          href="/" 
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Create Post Form */}
      <section className="rounded-xl border border-gray-200/40 p-6 bg-white/5 backdrop-blur">
        <h2 className="text-xl font-semibold mb-4">✨ Create New Post</h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <input
            type="text"
            placeholder="Post title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Post content..."
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isCreating || !newPost.title || !newPost.body}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? '⏳ Creating...' : '➕ Create Post'}
          </button>
        </form>
      </section>

      {/* Edit Post Form */}
      {editingPost && (
        <section className="rounded-xl border border-yellow-200/40 p-6 bg-yellow-50/5 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">✏️ Edit Post</h2>
          <form onSubmit={handleUpdatePost} className="space-y-4">
            <input
              type="text"
              value={editingPost.title}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <textarea
              value={editingPost.body}
              onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
              >
                {isUpdating ? '⏳ Updating...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Posts List */}
      <section className="rounded-xl border border-gray-200/40 p-6 bg-white/5 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">📋 All Posts ({posts.length})</h2>
        </div>
        
        <div className="grid gap-4">
          {posts.slice(0, 10).map((post) => (
            <div key={post.id} className="p-4 rounded-lg border border-gray-200/40 bg-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-3">{post.body}</p>
                  <p className="text-sm text-gray-500">Post ID: {post.id} | User ID: {post.userId}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? '⏳' : '🗑️'} Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {posts.length > 10 && (
          <p className="text-center text-gray-500 mt-4">
            Showing first 10 of {posts.length} posts
          </p>
        )}
      </section>
    </main>
  )
}
