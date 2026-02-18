export interface User {
  id: string
  email: string
  user_metadata: {
    name: string
    avatar_url: string
  }
}

export interface Session {
  user: User
  access_token: string
  expires_at: number
}

export interface AuthResult {
  success: boolean
  error?: string
  session?: Session
}

export interface Subscription {
  unsubscribe: () => void
}

export interface AuthService {
  signInWithGoogle(): Promise<AuthResult>
  signOut(): Promise<void>
  getSession(): Promise<Session | null>
  onAuthStateChange(callback: (session: Session | null) => void): Subscription
}
