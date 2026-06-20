import LoginForm from "../features/auth/LoginForm";

function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-white px-6 py-12 text-gray-900 dark:bg-gray-950 dark:text-white lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Project YouTube
        </p>

        <h1 className="mt-8 text-center text-2xl font-bold">
          Sign in to your account
        </h1>
      </div>

      <LoginForm />
    </main>
  );
}

export { LoginPage }