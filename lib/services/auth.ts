import { supabase } from '../supabase/client'
import type { AuthService, AuthResult, Session, Subscription } from '@/types'

class AuthServiceImpl implements AuthService {

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw new Error('Unable to sign out. Please try again.')
      }
    } catch (error) {
      console.error('Sign out failed:', error)
      throw new Error('Unable to sign out. Please try again.')
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Failed to retrieve session:', error)
        return null
      }

      if (!data.session) {
        return null
      }

      const supabaseSession = data.session

      return {
        user: {
          id: supabaseSession.user.id,
          email: supabaseSession.user.email || '',
          user_metadata: {
            name: supabaseSession.user.user_metadata?.name || '',
            avatar_url: supabaseSession.user.user_metadata?.avatar_url || '',
          },
        },
        access_token: supabaseSession.access_token,
        expires_at: supabaseSession.expires_at || 0,
      }
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  onAuthStateChange(
    callback: (session: Session | null) => void
  ): Subscription {
    try {
      const { data: subscription } = supabase.auth.onAuthStateChange(
        async (_event, supabaseSession) => {
          try {
            if (!supabaseSession) {
              callback(null)
              return
            }

            const session: Session = {
              user: {
                id: supabaseSession.user.id,
                email: supabaseSession.user.email || '',
                user_metadata: {
                  name: supabaseSession.user.user_metadata?.name || '',
                  avatar_url: supabaseSession.user.user_metadata?.avatar_url || '',
                },
              },
              access_token: supabaseSession.access_token,
              expires_at: supabaseSession.expires_at || 0,
            }

            callback(session)
          } catch (error) {
            console.error('Error processing auth state change:', error)
            callback(null)
          }
        }
      )

      return {
        unsubscribe: () => {
          try {
            subscription.subscription.unsubscribe()
          } catch (error) {
            console.error('Error unsubscribing from auth state changes:', error)
          }
        },
      }
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
      // Return a no-op subscription if setup fails
      return {
        unsubscribe: () => { },
      }
    }
  }
}

export const authService = new AuthServiceImpl()