import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

// Header: sticky top nav — hamburger, logo, search, create, notifications, avatar
function Header({ toggleSidebar }) {

  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();

  // Controls visibility of the avatar dropdown
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setAvatarOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm transition-colors dark:bg-[#1f3325] dark:shadow-black/20">

      {/* ── LEFT SECTION ──────────────────────────────────────────────────────────
          Hamburger button (toggles sidebar) + logo link
          Logo shows full name on sm+ screens, single letter on mobile
      ─────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Hamburger button */}
        <button onClick={toggleSidebar} className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-900 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo — links to home */}
        <Link to="/" className="flex items-center gap-1.5">
          {/* Full name on sm+ screens */}
          <span className="hidden text-xl font-bold tracking-tight text-[#429b5f] dark:text-[#8be0a6] sm:block">
            Project
          </span>
          {/* Abbreviated on mobile */}
          <span className="text-xl font-bold tracking-tight text-[#429b5f] dark:text-[#8be0a6] sm:hidden">
            P
          </span>
        </Link>
      </div>


      {/* ── SEARCH SECTION ────────────────────────────────────────────────────────
          Hidden on mobile (md:flex), shows on medium+ screens.
          Contains: text search input, search submit button, mic/voice button
      ─────────────────────────────────────────────────────────────────────────── */}
      <div className="hidden max-w-3xl flex-1 items-center justify-center px-8 md:flex">

        {/* Search bar: input + search icon button */}
        <div className="flex w-full items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-inner transition-colors focus-within:border-[#429b5f] dark:border-gray-600 dark:bg-black/20 dark:focus-within:border-[#8be0a6]">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent px-5 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
          />
          {/* Search submit button */}
          <button className="border-l border-gray-300 bg-gray-50 px-5 py-2.5 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-white/5 dark:hover:bg-white/10">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

      </div>


      {/* ── RIGHT SECTION ─────────────────────────────────────────────────────────
          Mobile search icon | Create dropdown | Notifications bell | Avatar menu
      ─────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Mobile-only search icon (hidden on md+) */}
        <button className="rounded-full p-2 transition-colors hover:bg-gray-100 md:hidden dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-900 dark:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        {/* Create button + hover dropdown — only shown when logged in */}
        {isLoggedIn && (
          <div className="group relative">
            {/* Create trigger button */}
            <button className="flex items-center gap-1.5 rounded-full bg-[#429b5f] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#36844f] hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#429b5f] dark:bg-[#429b5f] sm:px-4">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">Create</span>
            </button>

            {/* Dropdown menu — visible on group hover */}
            <div className="invisible absolute right-0 mt-2 w-48 origin-top-right translate-y-1 scale-95 rounded-xl border border-gray-100 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 dark:border-gray-700 dark:bg-[#253D2C]">
              {/* Upload Video option — Link instead of <a href="#"> */}
              <Link to="/upload" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload Video
              </Link>
              {/* Create Room option — Link instead of <a href="#"> */}
              <Link to="/rooms/create" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Create Room
              </Link>
            </div>
          </div>
        )}

        {/* Notifications bell — only shown when logged in, hidden on mobile */}
        {isLoggedIn && (
          <button className="relative hidden rounded-full p-2 transition-colors hover:bg-gray-100 sm:block dark:hover:bg-white/10">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-900 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {/* Unread notification badge */}
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1f3325]">
              3
            </span>
          </button>
        )}

        {/* ── AVATAR / AUTH DROPDOWN ───────────────────────────────────────────────
            Logged in  → avatar image → dropdown: My Channel, Logout
            Logged out → generic icon → dropdown: Login, Register
        ─────────────────────────────────────────────────────────────────────────── */}
        <div className="relative sm:ml-2" ref={avatarRef}>
          {/* Avatar / generic user button — toggles dropdown */}
          <button
            onClick={() => setAvatarOpen((prev) => !prev)}
            className="flex items-center focus:outline-none"
            aria-haspopup="true"
            aria-expanded={avatarOpen}
          >
            {isLoggedIn ? (
              /* Real avatar when logged in */
              <img
                className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition-all hover:ring-[#429b5f] dark:hover:ring-[#8be0a6]"
                src={user.avatar}
                alt={user.fullName}
              />
            ) : (
              /* Generic icon when logged out */
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-2 ring-transparent transition-all hover:ring-[#429b5f] dark:bg-white/10 dark:hover:ring-[#8be0a6]">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            )}
          </button>

          {/* Dropdown panel */}
          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-[#253D2C]">
              {isLoggedIn ? (
                <>
                  {/* User info header */}
                  <div className="border-b border-gray-100 px-4 pb-2 dark:border-gray-700">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.fullName}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{user.userName}</p>
                  </div>

                  {/* My Channel link */}
                  <Link
                    to={`/channel/${user.userName}`}
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    My Channel
                  </Link>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-white/5"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login link */}
                  <Link
                    to="/login"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                    Login
                  </Link>

                  {/* Register link */}
                  <Link
                    to="/register"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export { Header }
