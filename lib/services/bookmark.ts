import { supabase } from '../supabase/client'
import type { BookmarkService, CreateBookmarkInput, Bookmark, ValidationResult } from '@/types'

class BookmarkServiceImpl implements BookmarkService {

  validateBookmarkInput(url: string, title: string): ValidationResult {
    const errors: { url?: string; title?: string } = {}
    let valid = true

    // Validate URL - must not be empty and should be a valid URL format
    if (!url || url.trim().length === 0) {
      errors.url = 'URL is required'
      valid = false
    } else {
      try {
        new URL(url)
      } catch {
        errors.url = 'Invalid URL format'
        valid = false
      }
    }

    // Validate title - must contain at least one non-whitespace character
    if (!title || title.trim().length === 0) {
      errors.title = 'Title is required'
      valid = false
    }

    return { valid, errors }
  }

  async createBookmark(data: CreateBookmarkInput): Promise<Bookmark> {
    // Validate input
    const validation = this.validateBookmarkInput(data.url, data.title)
    if (!validation.valid) {
      const errorMessages = Object.values(validation.errors).join(', ')
      throw new Error(`Validation failed: ${errorMessages}`)
    }

    try {
      const { data: bookmark, error } = await supabase
        .from('bookmarks')
        .insert({
          url: data.url.trim(),
          title: data.title.trim(),
          user_id: data.userId,
        })
        .select()
        .single()

      if (error) {
        console.error('Database error creating bookmark:', error)
        throw new Error('Unable to save bookmark. Please try again.')
      }

      if (!bookmark) {
        console.error('No bookmark data returned after creation')
        throw new Error('Unable to save bookmark. Please try again.')
      }

      return bookmark
    } catch (error) {
      if (error instanceof Error && error.message.includes('Validation failed')) {
        throw error
      }
      console.error('Error creating bookmark:', error)
      throw new Error('Unable to save bookmark. Please try again.')
    }
  }

  async getBookmarks(userId: string): Promise<Bookmark[]> {
    try {
      const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error fetching bookmarks:', error)
        throw new Error('Unable to load bookmarks. Please refresh the page.')
      }

      return bookmarks || []
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      throw new Error('Unable to load bookmarks. Please refresh the page.')
    }
  }

  async deleteBookmark(bookmarkId: string, userId: string): Promise<void> {
    try {
      // First verify ownership by fetching the bookmark
      const { data: bookmark, error: fetchError } = await supabase
        .from('bookmarks')
        .select('user_id')
        .eq('id', bookmarkId)
        .single()

      if (fetchError) {
        console.error('Database error verifying bookmark ownership:', fetchError)
        throw new Error('Unable to delete bookmark. Please try again.')
      }

      if (!bookmark) {
        throw new Error('Bookmark not found.')
      }

      // Verify ownership
      if (bookmark.user_id !== userId) {
        console.warn('Unauthorized delete attempt:', { bookmarkId, userId })
        throw new Error('You can only delete your own bookmarks.')
      }

      // Delete the bookmark
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Database error deleting bookmark:', deleteError)
        throw new Error('Unable to delete bookmark. Please try again.')
      }
    } catch (error) {
      if (error instanceof Error &&
        (error.message.includes('not found') ||
          error.message.includes('only delete your own'))) {
        throw error
      }
      console.error('Error deleting bookmark:', error)
      throw new Error('Unable to delete bookmark. Please try again.')
    }
  }
}

export const bookmarkService = new BookmarkServiceImpl()