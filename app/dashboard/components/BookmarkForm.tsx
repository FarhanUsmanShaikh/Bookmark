'use client'

import { useState, FormEvent } from 'react'
import { bookmarkService } from '@/lib/services'
import type { CreateBookmarkInput, Bookmark } from '@/types'
import ErrorMessage from '@/app/components/ErrorMessage'

interface BookmarkFormProps {
  userId: string
  onBookmarkCreated?: (bookmark: Bookmark) => void
}

export default function BookmarkForm({ userId, onBookmarkCreated }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    const validation = bookmarkService.validateBookmarkInput(url, title)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)

    try {
      const bookmarkData: CreateBookmarkInput = {
        url: url.trim(),
        title: title.trim(),
        userId,
      }

      const newBookmark = await bookmarkService.createBookmark(bookmarkData)

      setUrl('')
      setTitle('')
      setSuccessMessage('Successfully pinned to your library!')
      setTimeout(() => setSuccessMessage(''), 4000)

      if (onBookmarkCreated) {
        onBookmarkCreated(newBookmark)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Validation failed')) {
          const validation = bookmarkService.validateBookmarkInput(url, title)
          setErrors(validation.errors)
        } else {
          setErrors({ url: error.message })
        }
      } else {
        setErrors({ url: 'Something went wrong. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-card p-6 sm:p-10 relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

      <div className="relative">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Add to Archive</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              Resource Label
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Inspiration"
              className={`input-field ${errors.title ? 'border-red-500/50 bg-red-500/5' : ''}`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs font-bold text-red-500 ml-1 animate-slide-up">{errors.title}</p>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="url" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              Primary URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/vault"
              className={`input-field ${errors.url ? 'border-red-500/50 bg-red-500/5' : ''}`}
              disabled={isSubmitting}
            />
            {errors.url && (
              <p className="text-xs font-bold text-red-500 ml-1 animate-slide-up">{errors.url}</p>
            )}
          </div>

          <div className="md:col-span-2 pt-4">
            {successMessage && (
              <div className="mb-6 animate-slide-up">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider">{successMessage}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full sm:w-auto min-w-[200px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Securing...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Sync Bookmark</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
