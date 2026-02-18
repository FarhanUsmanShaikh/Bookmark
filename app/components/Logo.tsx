export default function Logo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-[10px] opacity-40 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Bookmark</span>
            </span>
        </div>
    )
}
