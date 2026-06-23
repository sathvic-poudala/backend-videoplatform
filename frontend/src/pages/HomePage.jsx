import { Header } from '../components/Header';
import { Sidebar } from '../components/sidebar';
import { Loader } from '../components/loader';
import { VideoCard } from '../components/VideoCard';
import { useState } from 'react';


function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 text-gray-900 antialiased transition-colors dark:bg-[#111c14] dark:text-white">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } min-h-0 shrink-0 overflow-x-hidden overflow-y-auto transition-[width] duration-300 ease-in-out`}
        >
          <Sidebar />
        </div>
        {/* Because the parent is locked, this overflow-y-auto now works perfectly! */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar [&::-webkit-scrollbar]:hidden">
            {["All", "Gaming", "Music", "React Routers", "Live", "Mixes", "Podcasts", "Computers", "News"].map((tag, index) => (
              <button 
                key={index}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  index === 0 
                    ? "bg-[#429b5f] text-white dark:bg-[#8be0a6] dark:text-[#111c14]" 
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? [...Array(6)].map((_, index) => <Loader key={`loader-${index}`} />)
              : [...Array(6)].map((_, index) => <VideoCard key={`video-${index}`} />)
            }
          </div>
          
        </main>
      </div>
    </div>
  );
}

export { HomePage }