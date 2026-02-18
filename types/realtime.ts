import { Bookmark } from './bookmark'

export interface RealtimeEvent {
  eventType: 'INSERT' | 'DELETE' | 'UPDATE'
  new: Bookmark | null
  old: Bookmark | null
}

export interface RealtimeSubscription {
  unsubscribe(): void
}

export interface RealtimeService {
  subscribeToBookmarks(
    userId: string,
    callback: (event: RealtimeEvent) => void
  ): RealtimeSubscription
}
