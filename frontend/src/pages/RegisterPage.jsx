import RegisterFrom from "../features/auth/RegisterFrom"
import { Link, useNavigate } from "react-router-dom";


function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6 py-12 transition-colors dark:from-[#1f3325] dark:to-[#111c14] lg:px-8">
        
            {/* THE UNIFIED CARD WRAPPER */}
            <div className="sm:mx-auto sm:w-full sm:max-w-xl rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all dark:border-[#1e4d2a] dark:bg-[#253D2C]/80 sm:p-10">
                
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <p className="text-xl font-bold text-[#2E6F40] dark:text-[#68BA7F]">
                        Project YouTube
                    </p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Join the community and start sharing your moments.
                    </p>
                </div>

                {/* Your Form Component */}
                <RegisterFrom />

                {/* Login Link */}
                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-[#2E6F40] transition-colors hover:text-[#1e4d2a] dark:text-[#68BA7F] dark:hover:text-[#CFFFDC]">
                        Sign in here
                    </Link>
                </p>
            </div>
        </main>
    )
}

export { RegisterPage }