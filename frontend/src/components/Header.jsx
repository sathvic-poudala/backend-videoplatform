function Header({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm transition-colors dark:bg-[#1f3325] dark:shadow-black/20">
      <div className="flex items-center gap-4 sm:gap-6">
        <button onClick={toggleSidebar} className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-900 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <a href="#" className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#429b5f] dark:text-[#8be0a6]">
            <path d="M19.5 12.222a.75.75 0 000-1.194L6.75 4.805a.75.75 0 00-1.125.64v13.11a.75.75 0 001.125.64l12.75-6.223z" />
          </svg>
          <span className="hidden text-xl font-bold tracking-tight text-[#429b5f] dark:text-[#8be0a6] sm:block">
            Project YouTube
          </span>
        </a>
      </div>

      <div className="hidden max-w-3xl flex-1 items-center justify-center px-8 md:flex">
        <div className="flex w-full items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-inner transition-colors focus-within:border-[#429b5f] dark:border-gray-600 dark:bg-black/20 dark:focus-within:border-[#8be0a6]">
          <input type="text" placeholder="Search" className="w-full bg-transparent px-5 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400" />
          <button className="border-l border-gray-300 bg-gray-50 px-5 py-2.5 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-white/5 dark:hover:bg-white/10">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
        <button className="ml-4 rounded-full bg-gray-100 p-2.5 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-900 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="rounded-full p-2 transition-colors hover:bg-gray-100 md:hidden dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-900 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <div className="group relative">
          <button className="flex items-center gap-1.5 rounded-full bg-[#429b5f] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#36844f] hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#429b5f] dark:bg-[#429b5f] sm:px-4">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">Create</span>
          </button>

          <div className="invisible absolute right-0 mt-2 w-48 origin-top-right translate-y-1 scale-95 rounded-xl border border-gray-100 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 dark:border-gray-700 dark:bg-[#253D2C]">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Upload Video
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Create Room
            </a>
          </div>
        </div>

        <button className="relative hidden rounded-full p-2 transition-colors hover:bg-gray-100 sm:block dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-900 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1f3325]">3</span>
        </button>

        <button className="flex items-center focus:outline-none sm:ml-2">
          <img className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition-all hover:ring-[#429b5f] dark:hover:ring-[#8be0a6]" src="https://ui-avatars.com/api/?name=Jane+Smith&background=429b5f&color=fff" alt="User avatar" />
        </button>
      </div>
    </header>
  );
}

export { Header }