'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services'
import ErrorMessage from '@/app/components/ErrorMessage'
import Logo from '@/app/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('Error checking authentication:', err)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const subscription = authService.onAuthStateChange((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.signInWithGoogle()
      if (!result.success) {
        setError(result.error || 'Authentication failed. Please try again.')
        setIsLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase animate-pulse">Establishing Secure Connection</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-5s' }}></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex justify-center mb-10">
            <Logo />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">
            Welcome Back
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            Your personal digital library, <br />
            synchronized and secure in the cloud.
          </p>
        </div>

        <div className="glass-card p-10 relative group animate-slide-up">
          {/* Card Inner Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative">
            {error && (
              <div className="mb-8 animate-slide-up">
                <ErrorMessage
                  message={error}
                  type="error"
                  onDismiss={() => setError(null)}
                />
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-300 shadow-2xl disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-[3px] border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
                  <span className="text-slate-400">Connecting...</span>
                </div>
              ) : (
                <>
                  <div className="bg-white p-2 rounded-lg shadow-xl">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-12 w-12 rounded-full border-[3px] border-slate-900 bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500 shadow-xl relative z-[i]">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-sm font-bold tracking-tight">Trusted by 2,000+ users worldwide</p>
                <div className="flex justify-center gap-1 mt-2 text-indigo-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
