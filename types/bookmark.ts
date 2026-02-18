export interface Bookmark {
  id: string
  url: string
  title: string
  user_id: string
  created_at: string
}

export interface CreateBookmarkInput {
  url: string
  title: string
  userId: string
}

export interface ValidationResult {
  valid: boolean
  errors: {
    url?: string
    title?: string
  }
}

export interface BookmarkService {
  createBookmark(data: CreateBookmarkInput): Promise<Bookmark>
  getBookmarks(userId: string): Promise<Bookmark[]>
  deleteBookmark(bookmarkId: string, userId: string): Promise<void>
  validateBookmarkInput(url: string, title: string): ValidationResult
}
