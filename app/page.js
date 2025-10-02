'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addByAmount, decrement, increment } from '../redux/counterSlice'
import { fetchUsers } from '../redux/usersSlice'
import Link from 'next/link'

export default function HomePage() {
  const count = useSelector((state) => state.counter.count)
  const { list: users, status, error } = useSelector((state) => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, status])

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🏠 Redux Toolkit Demo</h1>
        <Link 
          href="/posts" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          📝 View Posts (RTK Query) →
        </Link>
      </div>
      <section className="rounded-xl border border-gray-200/40 p-6 bg-white/5 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-4">🧮 Count: {count}</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={() => dispatch(increment())}>➕ Increment</button>
          <button className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700" onClick={() => dispatch(decrement())}>➖ Decrement</button>
          <button className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => dispatch(addByAmount(5))}>➕➕ Add 5</button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200/40 p-6 bg-white/5 backdrop-blur">
        <h2 className="text-xl font-semibold mb-4">👥 Users <h1 className='font-bold text-red-500'>createAsyncThunk</h1> </h2>
        {status === 'loading' && <p className="text-gray-500">Loading users…</p>}
        {status === 'failed' && <p className="text-red-600">{error}</p>}
        {status === 'succeeded' && (
          <ul className="grid sm:grid-cols-2 gap-4">
            {users.map((u) => (
              <li key={u.id} className="p-4 rounded-lg border border-gray-200/40 bg-white/10">
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                <p className="text-sm text-gray-600">{u.company?.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
