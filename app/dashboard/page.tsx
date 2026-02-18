'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authService, bookmarkService, realtimeService } from '@/lib/services'
import type { RealtimeSubscription, Bookmark } from '@/types'
import BookmarkForm from './components/BookmarkForm'
import BookmarkList from './components/BookmarkList'
import ErrorMessage from '@/app/components/ErrorMessage'
import Logo from '@/app/components/Logo'

/**
 * DashboardPage Component
 * Main workspace area with dark theme premium aesthetics
 */
export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userAvatar, setUserAvatar] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [error, setError] = useState<string>('')
  const realtimeSubscriptionRef = useRef<RealtimeSubscription | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authService.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUserEmail(session.user.email)
        setUserId(session.user.id)
        setUserName(session.user.user_metadata.name)
        setUserAvatar(session.user.user_metadata.avatar_url)

        try {
          const userBookmarks = await bookmarkService.getBookmarks(session.user.id)
          setBookmarks(userBookmarks)
        } catch (error) {
          setError('Failed to load bookmarks. Please refresh the page.')
        }

        setIsLoading(false)

        const subscription = realtimeService.subscribeToBookmarks(
          session.user.id,
          (event) => {
            if (event.eventType === 'INSERT' && event.new) {
              setBookmarks(prev => [event.new!, ...prev])
            } else if (event.eventType === 'DELETE' && event.old) {
              setBookmarks(prev => prev.filter(b => b.id !== event.old!.id))
            }
          }
        )
        realtimeSubscriptionRef.current = subscription
      }
    }
    checkAuth()
    return () => {
      if (realtimeSubscriptionRef.current) {
        realtimeSubscriptionRef.current.unsubscribe()
      }
    }
  }, [router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      if (realtimeSubscriptionRef.current) {
        realtimeSubscriptionRef.current.unsubscribe()
        realtimeSubscriptionRef.current = null
      }
      await authService.signOut()
      router.push('/login')
    } catch (error) {
      setIsLoggingOut(false)
      setError('Failed to logout. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase animate-pulse">Establishing Connection</p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-mesh pb-20">
      {/* Premium Dark Glass Navigation */}
      <nav className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden sm:flex items-center gap-4 py-2 px-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all duration-300">
              {userAvatar && (
                <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full border-2 border-slate-900 shadow-2xl" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-black text-white leading-none mb-1">{userName}</span>
                <span className="text-[10px] font-bold text-slate-500 leading-none uppercase tracking-wider">{userEmail}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-12 px-6 text-sm font-black text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 disabled:opacity-50 active:scale-95"
            >
              {isLoggingOut ? 'Leaving...' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 lg:px-12 pt-16 animate-slide-up">
        {/* Dynamic Header Section */}
        <div className="relative mb-24 group">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full blur-[2px] opacity-70"></div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Library</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
            Your high-fidelity workspace for digital resources and inspiration.
          </p>
        </div>

        {error && (
          <div className="mb-12">
            <ErrorMessage message={error} type="error" onDismiss={() => setError('')} />
          </div>
        )}

        <div className="space-y-24">
          <section className="relative">
            <div className="absolute -top-10 -left-1 flex items-center gap-3">
              <span className="w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 leading-none">Command Center</span>
            </div>
            <BookmarkForm
              userId={userId}
              onBookmarkCreated={(newBookmark) => {
                setBookmarks(prev => [newBookmark, ...prev])
              }}
            />
          </section>

          <section className="relative">
            <div className="absolute -top-10 -left-1 flex items-center gap-3">
              <span className="w-12 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 leading-none">Digital Archive</span>
            </div>
            <BookmarkList
              bookmarks={bookmarks}
              userId={userId}
              onBookmarkDeleted={(bookmarkId) => {
                setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
              }}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
