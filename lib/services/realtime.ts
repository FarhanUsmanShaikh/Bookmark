import { supabase } from '../supabase/client'
import type { RealtimeService, RealtimeEvent, RealtimeSubscription } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

class RealtimeServiceImpl implements RealtimeService {

  subscribeToBookmarks(
    userId: string,
    callback: (event: RealtimeEvent) => void
  ): RealtimeSubscription {
    try {
      // Create a channel for bookmark updates filtered by user_id
      const channel: RealtimeChannel = supabase
        .channel(`bookmarks:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            try {
              // Map Supabase payload to our RealtimeEvent interface
              const eventType = payload.eventType.toUpperCase() as 'INSERT' | 'DELETE' | 'UPDATE'

              const realtimeEvent: RealtimeEvent = {
                eventType,
                new: payload.new ? payload.new as any : null,
                old: payload.old ? payload.old as any : null,
              }

              callback(realtimeEvent)
            } catch (error) {
              console.error('Error processing realtime event:', error)
            }
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.error('Realtime subscription error for user:', userId, err)
          }
        })

      // Return subscription object with unsubscribe method
      return {
        unsubscribe: () => {
          try {
            supabase.removeChannel(channel)
          } catch (error) {
            console.error('Error unsubscribing from realtime channel:', error)
          }
        },
      }
    } catch (error) {
      console.error('Error setting up realtime subscription:', error)
      // Return a no-op subscription if setup fails
      return {
        unsubscribe: () => { },
      }
    }
  }
}

export const realtimeService = new RealtimeServiceImpl()