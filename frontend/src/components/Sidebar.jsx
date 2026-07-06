import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { getSubscribedChannels } from "../api/subscription.api";


// Sidebar: left navigation panel
function Sidebar() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
 
  useEffect(() => {

    if(!user) return;
    getSubscribedChannels(user._id)
      .then(res => setChannels(res.data.data))
      .catch(() => setChannels([]))
  },[user])

  return (
    <aside className="flex min-h-full w-64 flex-col border-r border-gray-200 bg-white transition-colors dark:border-[#1e4d2a] dark:bg-[#1f3325]">
      <div className="flex flex-1 flex-col gap-1 px-3 py-4">

        {/* Home — public */}
        <NavLink 
            to="/" 
            className={({ isActive }) => 
                `flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors ${
                isActive 
                    ? "bg-[#429b5f]/10 font-semibold text-[#429b5f] dark:bg-[#429b5f]/20 dark:text-[#8be0a6]" 
                    : "font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                }`
            }
            >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            <span className="text-sm">Home</span>
        </NavLink>

        {/* Tweets — protected, redirects to /login if not logged in */}
        <NavLink to="/tweets" className="flex items-center gap-4 rounded-xl px-3 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <span className="text-sm">Tweets</span>
        </NavLink>

        {/* Subscriptions — protected */}
        <NavLink to="/subscriptions" className="flex items-center gap-4 rounded-xl px-3 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
          <span className="text-sm">Subscriptions</span>
        </NavLink>

        <hr className="my-3 border-gray-200 dark:border-white/10" />

        {/* "You" section — personal links, all protected */}
        <h3 className="mb-1 px-3 text-base font-semibold text-gray-900 dark:text-white">You</h3>

        {/* Dashboard — protected */}
        <NavLink to="/dashboard" className="flex items-center gap-4 rounded-xl px-3 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span className="text-sm">Dashboard</span>
        </NavLink>

        {/* History — protected */}
        <NavLink to="/history" className="flex items-center gap-4 rounded-xl px-3 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">History</span>
        </NavLink>

        <hr className="my-3 border-gray-200 dark:border-white/10" />

        {/* Subscriptions list — TODO: replace dummy data with real API */}
        <h3 className="mb-2 px-3 text-base font-semibold text-gray-900 dark:text-white">Subscriptions</h3>

        {/* 20 dummy channels — placeholder until real data is loaded */}
        {channels.map((val, index) => (
          <NavLink key={index} to={`/channel/${val.channels.userName}`} className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
            <div className="flex items-center gap-3">
              {/* Channel avatar */}
              <img src={`${val.channels.avatar}`} alt="Channel" className="h-6 w-6 rounded-full object-cover" />
              <span className="line-clamp-1 text-sm font-medium text-gray-700 dark:text-gray-200">{val.channels.userName}</span>
            </div>
            {/* Live indicator dot — shown for first 3 channels */}
            {index < 3 && <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>}
          </NavLink>
        ))}

      </div>
    </aside>
  );
}

export { Sidebar };