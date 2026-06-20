import { Link } from "react-router-dom";

function NotFoundPage() {
    return(
        <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
            <h1 className="text-6xl font-bold">404</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Page not found
                </p>

                <Link
                    to="/"
                    className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                >
                Go home
            </Link>
        </main>
    )
}

export { NotFoundPage }