function VideoCard() {
    return (
      <div className="group flex cursor-pointer flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:bg-[#1f3325] dark:shadow-black/40 dark:hover:shadow-black/80">
      
      {/* Thumbnail */}
      {/* Removed the shadow from here, since the whole outer card now has it */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <img 
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
          alt="Thumbnail" 
          className="h-full w-full object-cover transition-transform duration-300 transform-gpu group-hover:scale-105" 
        />
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          14:20
        </span>
      </div>

      {/* Content */}
      <div className="flex items-start gap-3">
        <img 
          src="https://ui-avatars.com/api/?name=Tech+Guru&background=429b5f&color=fff" 
          alt="Avatar" 
          className="mt-0.5 h-9 w-9 shrink-0 rounded-full object-cover" 
        />
        <div className="flex flex-1 flex-col">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-gray-900 dark:text-white">
            Building a Fullstack YouTube Clone with React
          </h3>
          
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <span className="transition-colors hover:text-gray-900 dark:hover:text-white">Tech Guru</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <span>124K views</span>
            <span className="text-[10px] leading-none">•</span>
            <span>2 days ago</span>
          </div>
        </div>
      </div>
      
    </div>
    );
}

export { VideoCard }