'use client'

import { useState, useEffect, useRef } from 'react'
import { bookmarkService } from '@/lib/services'
import type { Bookmark } from '@/types'
import ErrorMessage from '@/app/components/ErrorMessage'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  userId: string
  onBookmarkDeleted?: (bookmarkId: string) => void
}

export default function BookmarkList({ bookmarks, userId, onBookmarkDeleted }: BookmarkListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState<Set<string>>(new Set())
  const [newlyAddedIds, setNewlyAddedIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string>('')
  const prevBookmarksRef = useRef<Bookmark[]>([])

  useEffect(() => {
    const prevIds = new Set(prevBookmarksRef.current.map(b => b.id))
    const currentIds = new Set(bookmarks.map(b => b.id))

    const newIds = bookmarks
      .filter(b => !prevIds.has(b.id))
      .map(b => b.id)

    if (newIds.length > 0) {
      setNewlyAddedIds(new Set(newIds))
      setTimeout(() => setNewlyAddedIds(new Set()), 2000)
    }
    prevBookmarksRef.current = bookmarks
  }, [bookmarks])

  const handleDelete = async (bookmarkId: string) => {
    setError('')
    setOptimisticDeletedIds(prev => new Set(prev).add(bookmarkId))
    setDeletingIds(prev => new Set(prev).add(bookmarkId))

    try {
      await bookmarkService.deleteBookmark(bookmarkId, userId)
      if (onBookmarkDeleted) {
        onBookmarkDeleted(bookmarkId)
      }
    } catch (err) {
      setOptimisticDeletedIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookmarkId)
        return newSet
      })
      setError(err instanceof Error ? err.message : 'Failed to delete bookmark.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookmarkId)
        return newSet
      })
    }
  }

  const visibleBookmarks = bookmarks.filter(
    bookmark => !optimisticDeletedIds.has(bookmark.id)
  )

  if (visibleBookmarks.length === 0) {
    return (
      <div className="glass-card p-20 text-center animate-slide-up relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative">
          <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/5">
            <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Archive Empty</h3>
          <p className="text-slate-500 max-w-xs mx-auto font-medium">Your digital sanctuary is ready for its first resource. Add a link above to begin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-4">
          Collection History
          <span className="badge-indigo">
            {visibleBookmarks.length} Items
          </span>
        </h2>
      </div>

      {error && (
        <div className="animate-slide-up">
          <ErrorMessage message={error} type="error" onDismiss={() => setError('')} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {visibleBookmarks.map((bookmark) => {
          const isDeleting = deletingIds.has(bookmark.id)
          const isNewlyAdded = newlyAddedIds.has(bookmark.id)
          const domain = new URL(bookmark.url).hostname

          return (
            <div
              key={bookmark.id}
              className={`glass-card p-6 group hover:bg-slate-900/60 hover:border-white/10 transition-all duration-500 ${isDeleting ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'
                } ${isNewlyAdded ? 'ring-2 ring-indigo-500/50 bg-indigo-500/10' : ''}`}
            >
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex w-16 h-16 bg-slate-900/80 rounded-2xl items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-indigo-500/30 group-hover:scale-110 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl uppercase shadow-lg shadow-indigo-500/20">
                    {bookmark.title.charAt(0)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-white truncate mb-1 group-hover:text-indigo-300 transition-colors">
                        {bookmark.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-white/5 rounded-md border border-white/5">
                          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-4 h-4 rounded-sm" />
                        </div>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-slate-500 hover:text-indigo-400 truncate transition-colors tracking-wide"
                        >
                          {domain}
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      disabled={isDeleting}
                      className="p-2.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                      aria-label="Delete"
                    >
                      {isDeleting ? (
                        <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Secured {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-x-2 group-hover:translate-x-0"
                    >
                      Access Content
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
