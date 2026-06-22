import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      {/* Background: Swapped bg-gray-900 for your dark forest green */}
      <main className="grid h-screen place-items-center bg-[#1f3325] px-6 py-24 sm:py-32 lg:px-8 transition-colors">
        <div className="text-center">
          {/* Accent text: Swapped indigo-400 for your mid-green */}
          <p className="text-base font-semibold text-[#68BA7F]">404</p>
          
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            Page not found
          </h1>
          
          <p className="mt-6 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-[#2E6F40] px-3.5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1e4d2a] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F40]"
            >
              Go back home
            </a>
            
            {/* Link color: Swapped white for a subtle mint/green transition */}
            <a href="/contact" className="text-sm font-semibold text-white hover:text-[#CFFFDC] transition-colors">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}


export { NotFoundPage }