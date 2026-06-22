import LoginForm from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
  
    <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6 py-12 transition-colors dark:from-[#1f3325] dark:to-[#111c14] lg:px-8">
      
      {/* THE UNIFIED CARD WRAPPER */}
      {/* Uses bg-white/80 for non-laggy transparency, plus your soft shadow and border */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 dark:bg-[#253D2C]/80 dark:border-[#1e4d2a] sm:p-10 rounded-2xl transition-all">
        
        {/* Header Section (Now inside the card) */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-[#2E6F40] dark:text-[#68BA7F]">
            Project YouTube
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Your Form */}
        <LoginForm />
        
      </div>
    </main>
  );
}

export { LoginPage }