function Loader() {
    return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="aspect-video w-full rounded-xl bg-gray-200 dark:bg-white/10"></div>
      <div className="flex items-start gap-3 pr-2">
        <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-gray-200 dark:bg-white/10"></div>
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div className="h-4 w-[85%] rounded-md bg-gray-200 dark:bg-white/10"></div>
          <div className="h-4 w-[60%] rounded-md bg-gray-200 dark:bg-white/10"></div>
          <div className="mt-1.5 h-3 w-[45%] rounded-md bg-gray-200 dark:bg-white/10"></div>
          <div className="h-3 w-[35%] rounded-md bg-gray-200 dark:bg-white/10"></div>
        </div>
      </div>
    </div>
  );
}

export { Loader };